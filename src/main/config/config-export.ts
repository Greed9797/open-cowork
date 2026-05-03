import { createCipheriv, createDecipheriv, pbkdf2Sync, randomBytes } from 'node:crypto';
import { type ApiConfigSet } from './config-store';

const PBKDF2_ITERATIONS = 100_000;
const PBKDF2_DIGEST = 'sha256';
const KEY_LENGTH = 32;
const IV_LENGTH = 12;
const TAG_LENGTH = 16;
const SALT_LENGTH = 32;

export interface ExportPayload {
  configSets: ApiConfigSet[];
  activeConfigSetId: string;
}

interface EncryptedBundle {
  v: number;
  salt: string;
  iv: string;
  ct: string;
  tag: string;
}

function deriveKey(password: string, salt: Buffer): Buffer {
  return pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, KEY_LENGTH, PBKDF2_DIGEST);
}

export function encryptConfig(payload: ExportPayload, password: string): string {
  const salt = randomBytes(SALT_LENGTH);
  const iv = randomBytes(IV_LENGTH);
  const key = deriveKey(password, salt);

  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const pt = Buffer.from(JSON.stringify(payload), 'utf8');
  const ct = Buffer.concat([cipher.update(pt), cipher.final()]);
  const tag = cipher.getAuthTag();

  const bundle: EncryptedBundle = {
    v: 1,
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    ct: ct.toString('base64'),
    tag: tag.toString('base64'),
  };
  return JSON.stringify(bundle);
}

export function decryptConfig(fileContent: string, password: string): ExportPayload {
  let bundle: EncryptedBundle;
  try {
    bundle = JSON.parse(fileContent) as EncryptedBundle;
  } catch {
    throw new Error('Arquivo inválido — não é um arquivo de configuração Open Cowork.');
  }

  if (bundle.v !== 1 || !bundle.salt || !bundle.iv || !bundle.ct || !bundle.tag) {
    throw new Error('Formato de arquivo inválido ou versão não suportada.');
  }

  const salt = Buffer.from(bundle.salt, 'base64');
  const iv = Buffer.from(bundle.iv, 'base64');
  const ct = Buffer.from(bundle.ct, 'base64');
  const tag = Buffer.from(bundle.tag, 'base64');
  const key = deriveKey(password, salt);

  if (tag.length !== TAG_LENGTH) {
    throw new Error('Arquivo corrompido.');
  }

  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);

  let pt: Buffer;
  try {
    pt = Buffer.concat([decipher.update(ct), decipher.final()]);
  } catch {
    throw new Error('Senha incorreta ou arquivo corrompido.');
  }

  let payload: ExportPayload;
  try {
    payload = JSON.parse(pt.toString('utf8')) as ExportPayload;
  } catch {
    throw new Error('Dados descriptografados inválidos.');
  }

  if (!Array.isArray(payload.configSets) || typeof payload.activeConfigSetId !== 'string') {
    throw new Error('Estrutura de configuração inválida no arquivo.');
  }

  return payload;
}
