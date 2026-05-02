import { ChannelBase, withRetry } from '../channel-base';
import { log, logError, logWarn } from '../../../utils/logger';
import type {
  TelegramChannelConfig,
  RemoteMessage,
  RemoteResponse,
  RemoteResponseContent,
} from '../../types';

const TELEGRAM_API = 'https://api.telegram.org';
const POLL_TIMEOUT = 30; // seconds — long-poll window
const MAX_MSG_LENGTH = 4096; // Telegram hard limit

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMsg;
}

interface TelegramMsg {
  message_id: number;
  from?: { id: number; is_bot: boolean; first_name?: string; username?: string };
  chat: { id: number; type: string };
  text?: string;
  entities?: { type: string; offset: number; length: number }[];
  date: number;
}

export class TelegramChannel extends ChannelBase {
  readonly type = 'telegram' as const;

  private config: TelegramChannelConfig;
  private offset = 0;
  private botId: number | null = null;
  private polling = false;
  private pollAbort: AbortController | null = null;

  constructor(config: TelegramChannelConfig) {
    super();
    this.config = config;
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
            this.handleMessage(update.message);
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

  private handleMessage(msg: TelegramMsg): void {
    if (!msg.text) return;
    if (msg.from?.is_bot) return;

    const chatId = String(msg.chat.id);
    const userId = String(msg.from?.id ?? 'unknown');
    const isGroup = msg.chat.type === 'group' || msg.chat.type === 'supergroup';
    const botMention = this.botId ? `@` : '';
    void botMention; // used below

    // Check if bot is mentioned (group messages require @BotUsername mention)
    const isMentioned = (msg.entities ?? []).some(
      (e) =>
        e.type === 'mention' && msg.text!.substring(e.offset, e.offset + e.length).startsWith('@')
    );

    // In groups, skip if bot is not mentioned and requireMention is set
    if (isGroup) {
      const groupCfg = this.config.groups?.[chatId];
      const requireMention = groupCfg?.requireMention ?? true;
      if (requireMention && !isMentioned) return;
      if (groupCfg?.allowFrom && !groupCfg.allowFrom.includes(userId)) return;
    }

    // Strip @BotUsername from text
    const cleanText = (msg.text ?? '').replace(/@\w+\s*/g, '').trim();

    const remote: RemoteMessage = {
      id: String(msg.message_id),
      channelType: 'telegram',
      channelId: chatId,
      sender: { id: userId, isBot: false },
      content: { type: 'text', text: cleanText },
      timestamp: msg.date * 1000,
      isGroup,
      isMentioned,
      raw: msg,
    };

    this.emitMessage(remote);
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
