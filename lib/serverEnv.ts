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
  return process.env.OPENAI_CHAT_MODEL ?? 'gpt-4.1-mini';
}
