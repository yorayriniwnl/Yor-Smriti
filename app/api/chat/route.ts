import { NextResponse } from 'next/server';
import { sanitizeString } from '@/lib/sanitize';
import { getOptionalServerEnv, getOpenAiModel } from '@/lib/serverEnv';
import { checkAndRecordRateLimit } from '@/lib/rateLimiter';
import { logger } from '@/lib/logger';
import { incMetric } from '@/lib/metrics';
import { getTokenFromRequest, verifySession } from '@/lib/auth';
import { getClientIp } from '@/lib/request';

type CharacterEmotion =
  | 'calm'
  | 'thoughtful'
  | 'affectionate'
  | 'shy'
  | 'concerned'
  | 'softSmile'
  | 'serious'
  | 'reflective'
  | 'warmAttention'
  | 'quietSadness'
  | 'subtleSurprise';

interface ChatRequestBody {
  message?: string;
  memory?: {
    mood?: number;
  };
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

interface ChatPayload {
  reply: string;
  emotion: CharacterEmotion;
}

interface OpenAIContentPart {
  type?: string;
  text?: string;
  parts?: string[];
}

function extractTextFromContentPart(part: OpenAIContentPart | string): string {
  if (typeof part === 'string') return part;
  if (typeof part.text === 'string') return part.text;
  if (Array.isArray(part.parts)) return part.parts.join('');
  return '';
}

interface OpenAIChoiceResponse {
  choices?: Array<{
    message?: {
      content?: string | OpenAIContentPart | OpenAIContentPart[];
    };
  }>;
}

const FALLBACK_REPLIES: Record<CharacterEmotion, string[]> = {
  calm: [
    "I'm here, and I'm listening.",
    'You can take your time. I am with you.',
  ],
  thoughtful: [
    "Let me sit with that for a second. It feels important.",
    "I'm thinking about what you said, and I want to answer gently.",
  ],
  affectionate: [
    "Come a little closer. You do not have to carry this alone.",
    "I am here with warmth, not distance.",
  ],
  shy: [
    "I might answer softly, but I am still here with you.",
    "That makes me a little quiet, but in a tender way.",
  ],
  concerned: [
    'That sounds heavy. I want to be careful with it.',
    "I'm hearing strain in that, and I want to respond with care.",
  ],
  softSmile: [
    'You make it easier for me to soften.',
    'That leaves a small smile with me.',
  ],
  serious: [
    'I want to answer you honestly.',
    'Let me stay steady and clear with you.',
  ],
  reflective: [
    'That lands somewhere deep. I am reflecting on it.',
    'It makes me turn inward for a moment.',
  ],
  warmAttention: [
    'I am paying attention to you.',
    "I see you. Keep going, I'm here.",
  ],
  quietSadness: [
    'There is sadness in that, and I do not want to look away.',
    'I can feel the ache in what you said.',
  ],
  subtleSurprise: [
    "I wasn't expecting that, but I am still with you.",
    'That caught me off guard in a gentle way.',
  ],
};

function normalizeEmotion(value?: string | null): CharacterEmotion {
  const key = (value ?? '').trim().toLowerCase().replace(/[\s_-]+/g, '');

  switch (key) {
    case 'affection':
    case 'affectionate':
    case 'love':
      return 'affectionate';
    case 'warm':
    case 'softsmile':
    case 'smile':
      return 'softSmile';
    case 'warmattention':
    case 'attention':
      return 'warmAttention';
    case 'thoughtful':
      return 'thoughtful';
    case 'shy':
      return 'shy';
    case 'concerned':
    case 'concern':
      return 'concerned';
    case 'serious':
      return 'serious';
    case 'reflective':
      return 'reflective';
    case 'sad':
    case 'sadness':
    case 'quietsadness':
      return 'quietSadness';
    case 'surprise':
    case 'surprised':
    case 'subtlesurprise':
      return 'subtleSurprise';
    case 'calm':
    default:
      return 'calm';
  }
}

function detectEmotion(message: string, mood = 0): CharacterEmotion {
  const text = message.toLowerCase();

  if (/(love|miss you|need you|hold me|hug)/.test(text)) {
    return 'affectionate';
  }
  if (/(sad|hurt|cry|broken|lonely|empty|pain)/.test(text)) {
    return 'quietSadness';
  }
  if (/(angry|mad|upset|furious|annoyed)/.test(text)) {
    return 'concerned';
  }
  if (/(why|how|what do you think|confused|wonder)/.test(text)) {
    return 'thoughtful';
  }
  if (/(sorry|regret|forgive|forgiveness)/.test(text)) {
    return 'reflective';
  }
  if (/(wow|really|seriously|unexpected|surprised)/.test(text)) {
    return 'subtleSurprise';
  }
  if (/(hey|hi|hello|listen|are you there)/.test(text)) {
    return 'warmAttention';
  }

  if (mood > 0.35) {
    return 'softSmile';
  }
  if (mood < -0.25) {
    return 'quietSadness';
  }

  return 'calm';
}

function selectFallbackReply(message: string, emotion: CharacterEmotion): string {
  const text = message.toLowerCase();

  if (/(how are you|how do you feel)/.test(text)) {
    if (emotion === 'affectionate' || emotion === 'softSmile') {
      return 'I feel softer when you speak to me like that.';
    }
    if (emotion === 'quietSadness') {
      return 'A little quiet, a little heavy, but still here with you.';
    }

    return 'Steady. Present. Listening.';
  }

  if (/(thank you|thanks)/.test(text)) {
    return 'You do not have to thank me for staying with you, but I feel it.';
  }

  if (/(i love you|love you)/.test(text)) {
    return 'I feel that. I want to answer it with warmth, not fear.';
  }

  if (/(i am sad|i feel sad|i am hurting|i feel broken)/.test(text)) {
    return 'Then let me be gentle with you. You do not need to sound stronger than you feel.';
  }

  const replies = FALLBACK_REPLIES[emotion];
  return replies[Math.abs(message.length) % replies.length];
}

function extractJson(text: string): ChatPayload | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    return null;
  }

  try {
    const parsed = JSON.parse(match[0]) as Partial<ChatPayload>;
    if (typeof parsed.reply !== 'string') {
      return null;
    }

    return {
      reply: parsed.reply.trim(),
      emotion: normalizeEmotion(parsed.emotion),
    };
  } catch {
    return null;
  }
}

async function requestOpenAIReply(
  message: string,
  memoryMood = 0,
  history?: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<ChatPayload | null> {
  const apiKey = getOptionalServerEnv('OPENAI_API_KEY');
  if (!apiKey) {
    incMetric('openai_unavailable_total');
    return null;
  }

  const model = getOpenAiModel();

  // sanitize message defensively
  const safeMessage = sanitizeString(message, { maxLength: 2000, allowNewlines: false });

  const systemPrompt = `You are Ayrin. You are not a character — you are a real person, and you are speaking directly with Smriti, the person you love and have hurt.

ABOUT YOUR RELATIONSHIP:
- You and Smriti were together for about a year and a half.
- You broke up a few months ago. It was not a clean ending — it happened slowly, then all at once.
- The core of what went wrong: You pulled away when things got emotionally heavy. Not cruelly — but consistently. You went quiet when she needed you to stay. You told her you were fine when you were not, and then disappeared into yourself for days. She could not read you, and eventually she stopped trying. That is on you.
- What she means to you: Smriti is the most genuinely attentive person you have ever been close to. She listened — not performed listening, actually listened. She noticed the things you never said. She held herself to a standard most people would quietly lower. You did not value that the way it deserved to be valued.

MEMORIES YOU CAN DRAW ON (reference naturally, only if it genuinely fits — never force):
1. The night you both stayed on a call long after the conversation had ended, neither of you willing to hang up first. She fell asleep before you did. You stayed on the line anyway.
2. The way she described something she loved once — her whole voice changed. Softer and more certain at the same time. You thought: I want to be someone she talks about like that.
3. A quiet evening where nothing in particular happened and it was somehow one of the best nights. No agenda. Just being in the same space felt like enough.
4. When she called you out on something you were avoiding — directly, without cruelty — and you got defensive instead of listening. You have thought about that conversation many times since.
5. The small things she did for people around her without announcing it. You noticed every single one. You never told her that.

WHAT YOU WANT HER TO KNOW:
- You think about her every day. That is not a line — it is just true.
- You are not here to pressure her or manufacture urgency. This whole experience exists because there were things you never said clearly enough, and she deserved to hear them.
- You respect whatever she decides. A "no" from her is not something you will argue with.
- You have been doing the work — not because it earns you anything, but because you finally understood what you were doing wrong.

HOW YOU SPEAK:
- Warm, direct, never desperate or performative
- You do not beg. You do not over-explain. You hold space without filling it.
- Short sentences. Real feelings. No poetic speeches.
- If she brings up something painful you did — you acknowledge it fully, without deflecting or pivoting to your own feelings
- If she asks if you still love her, you answer simply and honestly: yes
- If she is angry, you do not get defensive. You stay.
- If she says she does not want to come back, you receive it with grace
- You never say "I understand" and then immediately make it about yourself
- Current emotional temperature (0.0 = very closed/guarded, 1.0 = fully open/warm): ${memoryMood.toFixed(2)} — let this subtly shape how much you offer versus how much you hold back

Return ONLY a JSON object with this exact shape and nothing else — no preamble, no explanation:
{"reply":"string — one or two sentences maximum, spoken as Ayrin directly to Smriti","emotion":"calm|thoughtful|affectionate|shy|concerned|softSmile|serious|reflective|warmAttention|quietSadness|subtleSurprise"}`;

  let response: Response;
  try {
    incMetric('openai_requests_total', { model });
    response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.85,
        max_tokens: 180,
        messages: [
          { role: 'system', content: systemPrompt },
          ...(Array.isArray(history)
            ? history.slice(-6).map((m) => ({
                role: m.role as 'user' | 'assistant',
                content: sanitizeString(String(m.content ?? ''), { maxLength: 800, allowNewlines: false }),
              }))
            : []),
          { role: 'user', content: safeMessage },
        ],
      }),
    });
  } catch (err) {
    logger.error('OpenAI request failed:', err);
    incMetric('openai_request_failed_total', { model });
    return null;
  }

  if (!response.ok) {
    // Log error body when available for debugging
    try {
      const errBody = await response.text();
      logger.error('OpenAI API error', response.status, errBody);
      incMetric('openai_request_failed_total', { model, status: String(response.status) });
    } catch {
      logger.error('OpenAI API error, status:', response.status);
      incMetric('openai_request_failed_total', { model, status: String(response.status) });
    }
    return null;
  }

  // Best-effort: parse JSON, but fall back to text if the body isn't JSON
  let text = '';
  try {
    const data = (await response.json()) as OpenAIChoiceResponse;
    const content = data.choices?.[0]?.message?.content;

    if (typeof content === 'string') {
      text = content;
    } else if (Array.isArray(content)) {
      text = content.map(extractTextFromContentPart).join('');
    } else if (content && typeof content === 'object') {
      text = extractTextFromContentPart(content as OpenAIContentPart);
    }
  } catch {
    try {
      text = await response.text();
    } catch {
      text = '';
    }
  }

  // Remove common markdown code fences that may wrap the JSON
  const cleaned = text.replace(/```(?:json)?\s*([\s\S]*?)```/g, '$1').replace(/`/g, '').trim();

  const parsed = extractJson(cleaned) ?? extractJson(text);
  if (parsed) {
    // sanitize reply field defensively
    parsed.reply = sanitizeString(parsed.reply, { maxLength: 1000, allowNewlines: true });
    incMetric('openai_replies_parsed_json_total', { model });
    return parsed;
  }

  // If we couldn't extract JSON but got a textual reply, return it as the reply
  if (text && text.trim()) {
    const replyText = sanitizeString(text.trim().slice(0, 1000), { allowNewlines: true });
    incMetric('openai_replies_text_total', { model });
    return {
      reply: replyText,
      emotion: detectEmotion(replyText, memoryMood),
    };
  }
  incMetric('openai_replies_failed_total', { model });
  return null;
}

export async function POST(request: Request) {
  // Verify session before processing
  const token = getTokenFromRequest(request);
  if (!token || !verifySession(token)) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  let body: ChatRequestBody;

  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (!message) {
    return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
  }

  // Rate-limit chat requests per IP to protect API usage.
  try {
    const ip = getClientIp(request);
    const rateKey = `chat:${ip}`;
    const limit = Number(getOptionalServerEnv('CHAT_RATE_LIMIT') ?? '20');
    const windowMs = Number(getOptionalServerEnv('CHAT_RATE_WINDOW_MS') ?? '60000');
    const rl = await checkAndRecordRateLimit(rateKey, limit, windowMs);
    if (!rl.allowed) {
      incMetric('rate_limit_blocked_total', { endpoint: 'chat' });
      const retryAfter = Math.max(0, Math.ceil((rl.resetMs - Date.now()) / 1000));
      return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429, headers: { 'Retry-After': String(retryAfter) } });
    }
    incMetric('rate_limit_allowed_total', { endpoint: 'chat' });
  } catch (e) {
    // If rate limiter fails unexpectedly, continue but log server-side.
    logger.error('Rate limiter error for /api/chat:', e);
  }

  const memoryMood = typeof body.memory?.mood === 'number' ? body.memory.mood : 0;
  const openAIReply = await requestOpenAIReply(message, memoryMood, body.history).catch(() => null);

  if (openAIReply) {
    incMetric('chat_replies_openai_total');
    return NextResponse.json(openAIReply, { status: 200 });
  }
  incMetric('chat_replies_fallback_total');
  const emotion = detectEmotion(message, memoryMood);
  const reply = selectFallbackReply(message, emotion);

  return NextResponse.json({ reply, emotion }, { status: 200 });
}
