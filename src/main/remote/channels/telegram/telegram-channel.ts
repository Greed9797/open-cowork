import { ChannelBase, withRetry } from '../channel-base';
import { log, logError, logWarn } from '../../../utils/logger';
import { remoteConfigStore } from '../../remote-config-store';
import type {
  TelegramChannelConfig,
  RemoteMessage,
  RemoteResponse,
  RemoteResponseContent,
} from '../../types';

const TELEGRAM_API = 'https://api.telegram.org';
const GROQ_API = 'https://api.groq.com/openai/v1/audio/transcriptions';
const POLL_TIMEOUT = 30; // seconds — long-poll window
const MAX_MSG_LENGTH = 4096; // Telegram hard limit

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMsg;
}

interface TelegramVoice {
  file_id: string;
  file_unique_id: string;
  duration: number;
  mime_type?: string;
  file_size?: number;
}

interface TelegramMsg {
  message_id: number;
  from?: { id: number; is_bot: boolean; first_name?: string; username?: string };
  chat: { id: number; type: string };
  text?: string;
  voice?: TelegramVoice;
  audio?: TelegramVoice;
  entities?: { type: string; offset: number; length: number }[];
  date: number;
}

export class TelegramChannel extends ChannelBase {
  readonly type = 'telegram' as const;

  private config: TelegramChannelConfig;
  private groqApiKey?: string;
  private offset = 0;
  private botId: number | null = null;
  private polling = false;
  private pollAbort: AbortController | null = null;

  constructor(config: TelegramChannelConfig, groqApiKey?: string) {
    super();
    this.config = config;
    this.groqApiKey = groqApiKey;
  }

  async start(): Promise<void> {
    if (this._connected) {
      logWarn('[Telegram] Channel already started');
      return;
    }
    this.logStatus('Starting channel...');
    try {
      const me = await this.api<{ id: number; username?: string }>('getMe', {});
      this.botId = me.id;
      log('[Telegram] Bot ID:', this.botId, 'username:', me.username);

      // Flush any pending updates before we start so we don't replay old messages
      await this.api('getUpdates', { offset: -1, limit: 1 });

      this._connected = true;
      this.polling = true;
      void this.pollLoop();
      this.logStatus('Channel started successfully');
    } catch (err) {
      logError('[Telegram] Failed to start:', err);
      this._connected = false;
      throw err;
    }
  }

  async stop(): Promise<void> {
    if (!this._connected) return;
    this.logStatus('Stopping channel...');
    this.polling = false;
    this.pollAbort?.abort();
    this.pollAbort = null;
    this._connected = false;
    this.logStatus('Channel stopped');
  }

  async send(response: RemoteResponse): Promise<void> {
    if (!this._connected) throw new Error('Channel not connected');
    await withRetry(
      async () => {
        await this.sendContent(response.channelId, response.content);
      },
      {
        maxRetries: 3,
        delayMs: 1000,
        onRetry: (attempt, err) => logWarn(`[Telegram] Send retry ${attempt}:`, err.message),
      }
    );
  }

  // ─── Polling ────────────────────────────────────────────────────────────────

  private async pollLoop(): Promise<void> {
    while (this.polling) {
      try {
        this.pollAbort = new AbortController();
        const updates = await this.api<TelegramUpdate[]>(
          'getUpdates',
          { offset: this.offset, timeout: POLL_TIMEOUT, allowed_updates: ['message'] },
          this.pollAbort.signal
        );
        if (!this.polling) break;
        for (const update of updates) {
          this.offset = update.update_id + 1;
          if (update.message) {
            await this.handleMessage(update.message);
          }
        }
      } catch (err: unknown) {
        if (!this.polling) break;
        const isAbort = err instanceof Error && err.name === 'AbortError';
        if (!isAbort) {
          logWarn(
            '[Telegram] Poll error, retrying in 5s:',
            err instanceof Error ? err.message : err
          );
          await new Promise((r) => setTimeout(r, 5000));
        }
      }
    }
  }

  private async handleMessage(msg: TelegramMsg): Promise<void> {
    if (msg.from?.is_bot) return;

    const chatId = String(msg.chat.id);
    const userId = String(msg.from?.id ?? 'unknown');
    const isGroup = msg.chat.type === 'group' || msg.chat.type === 'supergroup';

    // Check if bot is mentioned (group messages require @BotUsername mention)
    const isMentioned = (msg.entities ?? []).some(
      (e) =>
        e.type === 'mention' &&
        (msg.text ?? '').substring(e.offset, e.offset + e.length).startsWith('@')
    );

    // In groups, skip if bot is not mentioned and requireMention is set
    if (isGroup) {
      const groupCfg = this.config.groups?.[chatId];
      const requireMention = groupCfg?.requireMention ?? true;
      if (requireMention && !isMentioned) return;
      if (groupCfg?.allowFrom && !groupCfg.allowFrom.includes(userId)) return;
    }

    let messageText: string | undefined;

    // Handle voice/audio messages via Groq transcription
    const audioFile = msg.voice ?? msg.audio;
    if (audioFile) {
      // Read key at runtime so changes saved after channel start are picked up
      const groqKey =
        remoteConfigStore.getAll().gateway.groqApiKey?.trim() || this.groqApiKey?.trim();
      if (!groqKey) {
        await this.api('sendMessage', {
          chat_id: chatId,
          text: '⚠️ Audio transcription not configured. Add a Groq API key in Remote Control → Advanced settings.',
        });
        return;
      }
      try {
        log('[Telegram] Transcribing audio file_id:', audioFile.file_id);
        messageText = await this.transcribeAudio(audioFile.file_id, groqKey);
        log('[Telegram] Transcription result:', messageText?.slice(0, 100));
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        logError('[Telegram] Audio transcription failed:', errMsg);
        await this.api('sendMessage', {
          chat_id: chatId,
          text: `⚠️ Transcription failed: ${errMsg.slice(0, 300)}\n\nPlease try again or send text.`,
        });
        return;
      }
    } else if (msg.text) {
      // Strip @BotUsername from text
      messageText = msg.text.replace(/@\w+\s*/g, '').trim();
    }

    if (!messageText) return;

    const remote: RemoteMessage = {
      id: String(msg.message_id),
      channelType: 'telegram',
      channelId: chatId,
      sender: { id: userId, isBot: false },
      content: { type: 'text', text: messageText },
      timestamp: msg.date * 1000,
      isGroup,
      isMentioned,
      raw: msg,
    };

    this.emitMessage(remote);
  }

  // ─── Audio Transcription ─────────────────────────────────────────────────────

  private async transcribeAudio(fileId: string, groqKey: string): Promise<string> {
    // Step 1: Get file path from Telegram
    const fileInfo = await this.api<{ file_path: string }>('getFile', { file_id: fileId });
    const fileUrl = `${TELEGRAM_API}/file/bot${this.config.botToken.trim()}/${fileInfo.file_path}`;

    // Step 2: Download audio bytes
    const audioRes = await fetch(fileUrl);
    if (!audioRes.ok) {
      throw new Error(`Failed to download Telegram audio: HTTP ${audioRes.status}`);
    }
    const audioBuffer = Buffer.from(await audioRes.arrayBuffer());

    // Step 3: Normalize extension — Telegram voice messages use .oga (Opus in OGG container)
    // Groq Whisper accepts 'ogg' but not 'oga'; both are the same container.
    const rawExt = (fileInfo.file_path.split('.').pop() || 'ogg').toLowerCase();
    const ext = rawExt === 'oga' ? 'ogg' : rawExt;
    const filename = `voice.${ext}`;

    // Step 4: Build multipart form using Node.js-compatible boundary approach
    const boundary = `----FormBoundary${Math.random().toString(36).slice(2)}`;
    const CRLF = '\r\n';
    const parts: Buffer[] = [];

    const addField = (name: string, value: string) => {
      parts.push(
        Buffer.from(
          `--${boundary}${CRLF}` +
            `Content-Disposition: form-data; name="${name}"${CRLF}${CRLF}` +
            `${value}${CRLF}`
        )
      );
    };

    addField('model', 'whisper-large-v3-turbo');
    addField('response_format', 'text');

    // File part
    parts.push(
      Buffer.from(
        `--${boundary}${CRLF}` +
          `Content-Disposition: form-data; name="file"; filename="${filename}"${CRLF}` +
          `Content-Type: audio/${ext}${CRLF}${CRLF}`
      )
    );
    parts.push(audioBuffer);
    parts.push(Buffer.from(`${CRLF}--${boundary}--${CRLF}`));

    const body = Buffer.concat(parts);

    const groqRes = await fetch(GROQ_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${groqKey}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body,
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text().catch(() => '');
      throw new Error(`Groq HTTP ${groqRes.status}: ${errText.slice(0, 300)}`);
    }

    const transcription = await groqRes.text();
    return transcription.trim();
  }

  // ─── Send ────────────────────────────────────────────────────────────────────

  private async sendContent(chatId: string, content: RemoteResponseContent): Promise<void> {
    let text: string;
    switch (content.type) {
      case 'markdown':
        text = content.markdown || '';
        break;
      default:
        text = content.text || '';
    }

    const chunks = this.splitMessage(text, MAX_MSG_LENGTH);
    for (const chunk of chunks) {
      await this.api('sendMessage', {
        chat_id: chatId,
        text: chunk,
        parse_mode: 'Markdown',
      });
      if (chunks.length > 1) await new Promise((r) => setTimeout(r, 150));
    }
  }

  // ─── API ─────────────────────────────────────────────────────────────────────

  private async api<T = unknown>(
    method: string,
    params: Record<string, unknown>,
    signal?: AbortSignal
  ): Promise<T> {
    const url = `${TELEGRAM_API}/bot${this.config.botToken.trim()}/${method}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Telegram API ${method} HTTP ${res.status}: ${text.slice(0, 200)}`);
    }
    const json = (await res.json()) as { ok: boolean; result?: T; description?: string };
    if (!json.ok) {
      throw new Error(`Telegram API ${method} error: ${json.description ?? 'unknown'}`);
    }
    return json.result as T;
  }
}
