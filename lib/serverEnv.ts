import { logger } from './logger';

export function getRequiredServerEnv(name: string): string {
  const val = process.env[name];
  if (!val) {
    logger.error(`Missing required server environment variable: ${name}`);
    throw new Error(`Missing required server environment variable: ${name}`);
  }
  return val;
}

export function getOptionalServerEnv(name: string): string | null {
  return process.env[name] ?? null;
}

export function getOpenAiModel(): string {
  return process.env.OPENAI_CHAT_MODEL ?? 'gpt-4o-mini';
}

// ─── Personalization ─────────────────────────────────────────────────────────

export interface PersonalizationConfig {
  recipientName: string;
  senderName: string;
  memory: string;
  message: string;
}

export function getPersonalizationConfig(): PersonalizationConfig {
  return {
    recipientName: process.env.RECIPIENT_NAME     ?? 'Smriti',
    senderName:    process.env.SENDER_NAME        ?? 'Ayrin',
    memory:        process.env.RECIPIENT_MEMORY   ?? 'that rainy chai walk',
    message:       process.env.SENDER_MESSAGE     ?? 'I am still here, trying to become better.',
  };
}
