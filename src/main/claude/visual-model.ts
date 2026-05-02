/**
 * Visual model bridge — sends images to a Gemini Vision model and returns
 * a text description. Used by the dual-model feature to augment screenshot
 * tool results with Gemini's visual analysis before forwarding to the
 * primary text model.
 */

import { log, logWarn, logError } from '../utils/logger';
import { configStore } from '../config/config-store';

interface ImageInput {
  data: string;
  mimeType: string;
}

interface VisualModelConfig {
  apiKey: string;
  baseUrl?: string;
  model: string;
  provider?: string;
}

const VISION_PROMPT =
  'Você é um analista visual de e-commerce. Descreva com precisão o que vê neste screenshot: ' +
  'layout, elementos de UI, textos visíveis, cores, estrutura da página, problemas de UX, ' +
  'indicadores de conversão, e qualquer detalhe relevante para diagnóstico de e-commerce. ' +
  'Seja técnico e direto. Máximo 300 palavras.';

async function analyzeImageWithOpenAI(
  config: VisualModelConfig,
  images: ImageInput[]
): Promise<string> {
  const baseUrl = (config.baseUrl?.trim() || 'https://integrate.api.nvidia.com/v1').replace(
    /\/$/,
    ''
  );
  const url = `${baseUrl}/chat/completions`;

  const imageContent = images.map((img) => ({
    type: 'image_url',
    image_url: { url: `data:${img.mimeType};base64,${img.data}` },
  }));

  const body = {
    model: config.model,
    messages: [
      {
        role: 'user',
        content: [{ type: 'text', text: VISION_PROMPT }, ...imageContent],
      },
    ],
    max_tokens: 500,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey.trim()}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) {
    throw new Error(`NVIDIA NIM vision HTTP ${res.status}`);
  }

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const text = data.choices?.[0]?.message?.content;
  if (!text) return '';

  log('[VisualModel] NVIDIA analysis complete:', text.substring(0, 100));
  return `\n\n[ANÁLISE VISUAL — NVIDIA ${config.model}]\n${text}`;
}

export async function analyzeImage(
  config: VisualModelConfig,
  images: ImageInput[]
): Promise<string> {
  if (!config.apiKey?.trim() || images.length === 0) return '';
  try {
    if (config.provider === 'nvidia') {
      return await analyzeImageWithOpenAI(config, images);
    }
    return await analyzeImageWithGemini(config, images);
  } catch (err) {
    logWarn('[VisualModel] analyzeImage failed:', err instanceof Error ? err.message : err);
    return '';
  }
}

export async function analyzeImageWithGemini(
  config: VisualModelConfig,
  images: ImageInput[]
): Promise<string> {
  if (!config.apiKey?.trim() || images.length === 0) return '';

  try {
    const { GoogleGenAI } = (await import('@google/genai')) as typeof import('@google/genai');
    const httpOptions: Record<string, unknown> = { timeout: 30000 };
    if (config.baseUrl?.trim()) {
      httpOptions.baseUrl = config.baseUrl.trim();
    }
    const client = new GoogleGenAI({ apiKey: config.apiKey.trim(), httpOptions });

    const contents = [
      { text: VISION_PROMPT },
      ...images.map((img) => ({
        inlineData: { data: img.data, mimeType: img.mimeType },
      })),
    ];

    const response = await client.models.generateContent({
      model: config.model,
      contents: [{ role: 'user', parts: contents }],
    });

    const text = response.candidates?.[0]?.content?.parts
      ?.filter((p: { text?: string }) => p.text)
      .map((p: { text?: string }) => p.text)
      .join('\n');

    if (!text) return '';

    log('[VisualModel] Gemini analysis complete:', text.substring(0, 100));
    return `\n\n[ANÁLISE VISUAL — Gemini ${config.model}]\n${text}`;
  } catch (err) {
    logWarn('[VisualModel] Gemini vision call failed:', err instanceof Error ? err.message : err);
    return '';
  }
}

export function isDualModelEnabled(): boolean {
  try {
    return Boolean(configStore.get('dualModelEnabled'));
  } catch {
    return false;
  }
}

export function getVisualModelConfig(): VisualModelConfig | null {
  try {
    const enabled = Boolean(configStore.get('dualModelEnabled'));
    if (!enabled) return null;
    const apiKey = String(configStore.get('visualModelApiKey') ?? '');
    const baseUrl = String(configStore.get('visualModelBaseUrl') ?? '');
    const model = String(configStore.get('visualModel') ?? 'gemini-2.5-flash');
    const provider = String(configStore.get('visualModelProvider') ?? 'gemini');
    if (!apiKey.trim()) return null;
    return { apiKey, baseUrl, model, provider };
  } catch (err) {
    logError('[VisualModel] Failed to read config:', err);
    return null;
  }
}
