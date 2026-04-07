import { NextResponse } from 'next/server';

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
}

interface ChatPayload {
  reply: string;
  emotion: CharacterEmotion;
}

interface OpenAIChoiceResponse {
  choices?: Array<{
    message?: {
      content?: string | Array<{ text?: string; type?: string }>;
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
  memoryMood = 0
): Promise<ChatPayload | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const model = process.env.OPENAI_CHAT_MODEL ?? 'gpt-4.1-mini';
  const systemPrompt = [
    'You are Ayrin, a warm and emotionally intelligent male character speaking with gentle confidence.',
    'Reply in one or two short sentences.',
    'Return ONLY JSON with this exact shape:',
    '{"reply":"string","emotion":"calm|thoughtful|affectionate|shy|concerned|softSmile|serious|reflective|warmAttention|quietSadness|subtleSurprise"}',
    `The user's current mood memory is ${memoryMood.toFixed(2)}.`,
  ].join(' ');

  let response: Response;
  try {
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
          { role: 'user', content: message },
        ],
      }),
    });
  } catch (err) {
    console.error('OpenAI request failed:', err);
    return null;
  }

  if (!response.ok) {
    // Log error body when available for debugging
    try {
      const errBody = await response.text();
      console.error('OpenAI API error', response.status, errBody);
    } catch (e) {
      console.error('OpenAI API error, status:', response.status);
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
      text = content
        .map((part) => {
          if (!part) return '';
          // part may be an object with different shapes (text, parts, etc.)
          if (typeof (part as any) === 'string') return part as any;
          return (part as any).text ?? (Array.isArray((part as any).parts) ? (part as any).parts.join('') : '');
        })
        .join('');
    } else if (content && typeof content === 'object') {
      // handle content objects with `parts`
      text = Array.isArray((content as any).parts) ? (content as any).parts.join('') : JSON.stringify(content);
    }
  } catch (err) {
    // response wasn't JSON — try to read as text
    try {
      text = await response.text();
    } catch {
      text = '';
    }
  }

  // Remove common markdown code fences that may wrap the JSON
  const cleaned = text.replace(/```(?:json)?\s*([\s\S]*?)```/g, '$1').replace(/`/g, '').trim();

  const parsed = extractJson(cleaned) ?? extractJson(text);
  if (parsed) return parsed;

  // If we couldn't extract JSON but got a textual reply, return it as the reply
  if (text && text.trim()) {
    const replyText = text.trim().slice(0, 1000);
    return {
      reply: replyText,
      emotion: detectEmotion(replyText, memoryMood),
    };
  }

  return null;
}

export async function POST(request: Request) {
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

  const memoryMood = typeof body.memory?.mood === 'number' ? body.memory.mood : 0;
  const openAIReply = await requestOpenAIReply(message, memoryMood).catch(() => null);

  if (openAIReply) {
    return NextResponse.json(openAIReply, { status: 200 });
  }

  const emotion = detectEmotion(message, memoryMood);
  const reply = selectFallbackReply(message, emotion);

  return NextResponse.json({ reply, emotion }, { status: 200 });
}
