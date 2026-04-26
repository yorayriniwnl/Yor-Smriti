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
  relationshipLength: string;
  breakupTimeframe: string;
  breakupReason: string;
  whatSheMeansToMe: string;
  memory1: string;
  memory2: string;
  memory3: string;
  memory4: string;
  memory5: string;
  wantHerToKnow1: string;
  wantHerToKnow2: string;
  wantHerToKnow3: string;
}

export function getPersonalizationConfig(): PersonalizationConfig {
  return {
    recipientName:      process.env.RECIPIENT_NAME            ?? 'Smriti',
    senderName:         process.env.SENDER_NAME               ?? 'Ayrin',
    memory:             process.env.RECIPIENT_MEMORY          ?? 'that rainy chai walk',
    message:            process.env.SENDER_MESSAGE            ?? 'I am still here, trying to become better.',
    relationshipLength: process.env.CHAT_RELATIONSHIP_LENGTH  ?? 'about a year and a half',
    breakupTimeframe:   process.env.CHAT_BREAKUP_TIMEFRAME    ?? 'a few months ago',
    breakupReason:      process.env.CHAT_BREAKUP_REASON       ?? 'I kept pulling away emotionally whenever things got serious. She needed consistency and I gave her uncertainty.',
    whatSheMeansToMe:   process.env.CHAT_WHAT_SHE_MEANS       ?? 'She is the most honest person I have ever been close to. She always said exactly what she meant, and I never appreciated that until I lost it.',
    memory1:            process.env.CHAT_MEMORY_1             ?? 'The night we sat talking until 2am about what we both actually wanted from life.',
    memory2:            process.env.CHAT_MEMORY_2             ?? 'The way she laughed at something small and then went quiet, like she was surprised by her own happiness.',
    memory3:            process.env.CHAT_MEMORY_3             ?? 'Walking in the rain and neither of us wanting to go inside.',
    memory4:            process.env.CHAT_MEMORY_4             ?? 'Her reading quietly beside me, not needing to fill the silence.',
    memory5:            process.env.CHAT_MEMORY_5             ?? 'The last time I saw her — I knew it and said nothing.',
    wantHerToKnow1:     process.env.CHAT_WANT_HER_TO_KNOW_1  ?? 'That I think about her every day and I am not saying that to pressure her.',
    wantHerToKnow2:     process.env.CHAT_WANT_HER_TO_KNOW_2  ?? 'That I have actually tried to understand what I was doing wrong.',
    wantHerToKnow3:     process.env.CHAT_WANT_HER_TO_KNOW_3  ?? 'That I respect whatever she decides. This is not to win her back by force — it is to tell the truth I never told her clearly.',
  };
}

// ─── Client-safe personalization ──────────────────────────────────────────────
// Only the 4 fields the client UI actually renders. AI system-prompt fields
// (breakupReason, memory1-5, whatSheMeansToMe, wantHerToKnow1-3) must never
// leave the server — exposing them via /api/config would let the recipient read
// every private statement intended only to shape how the AI speaks.

export interface ClientPersonalizationConfig {
  recipientName: string;
  senderName: string;
  memory: string;
  message: string;
}

export function getClientPersonalizationConfig(): ClientPersonalizationConfig {
  return {
    recipientName: process.env.RECIPIENT_NAME   ?? 'Smriti',
    senderName:    process.env.SENDER_NAME      ?? 'Ayrin',
    memory:        process.env.RECIPIENT_MEMORY ?? 'that rainy chai walk',
    message:       process.env.SENDER_MESSAGE   ?? 'I am still here, trying to become better.',
  };
}
