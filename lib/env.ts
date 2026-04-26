/**
 * Runtime environment validation.
 * Called once at server startup — fails loud in production if critical vars are missing.
 * In development, logs warnings instead.
 */

interface EnvVar {
  name: string;
  required: boolean;
  description: string;
  validate?: (v: string) => boolean;
  validationError?: string;
}

const ENV_SCHEMA: EnvVar[] = [
  {
    name: 'AUTH_SECRET',
    required: true,
    description: 'JWT signing secret (≥32 chars)',
    validate: (v) => v.length >= 32,
    validationError: 'AUTH_SECRET must be at least 32 characters',
  },
  {
    name: 'APP_USERNAME',
    required: false,
    description: 'Login username (leave blank for open access)',
  },
  {
    name: 'APP_PASSWORD',
    required: false,
    description: 'Login password (leave blank for open access)',
  },
  {
    name: 'OPENAI_API_KEY',
    required: false,
    description: 'OpenAI API key for AI chat (falls back to local replies)',
  },
  {
    name: 'NOTIFICATION_EMAIL',
    required: false,
    description: 'Email address for admin notifications',
  },
  {
    name: 'REDIS_URL',
    required: false,
    description: 'Redis connection string for shared rate limiting',
  },
  {
    name: 'RESEND_API_KEY',
    required: false,
    description: 'Resend API key for transactional email',
  },
  {
    name: 'SENDER_EMAIL',
    required: false,
    description: 'From address for outgoing emails',
  },
  {
    name: 'UPSTASH_REDIS_REST_URL',
    required: false,
    description: 'Upstash Redis REST URL (serverless rate limiting)',
  },
  {
    name: 'UPSTASH_REDIS_REST_TOKEN',
    required: false,
    description: 'Upstash Redis REST token',
  },
  {
    name: 'NEXT_PUBLIC_BASE_URL',
    required: false,
    description: 'Public base URL for canonical links',
  },
  // ── Proxy / infra ──────────────────────────────────────────────────────────
  {
    name: 'TRUST_PROXY',
    required: false,
    description: 'Set to "1" on Vercel / behind a trusted reverse proxy — enables real-IP extraction for rate limiting. Without this every request shares the "unknown" rate-limit bucket.',
  },
  // ── Protected-page password ────────────────────────────────────────────────
  {
    name: 'HER_UNLOCK_PASSWORD',
    required: false,
    description: 'Password for the /for-her-alone page. If unset the page is blocked for everyone.',
  },
  // ── Metrics scrape auth ────────────────────────────────────────────────────
  {
    name: 'METRICS_SCRAPE_SECRET',
    required: false,
    description: 'Bearer token for the Prometheus /api/metrics scrape endpoint (allows scraping without a session cookie).',
  },
  // ── Rate-limit tunables ────────────────────────────────────────────────────
  {
    name: 'LOGIN_RATE_LIMIT',
    required: false,
    description: 'Max login attempts per window (default: 10)',
    validate: (v) => !isNaN(Number(v)) && Number(v) > 0,
    validationError: 'LOGIN_RATE_LIMIT must be a positive integer',
  },
  {
    name: 'LOGIN_RATE_WINDOW_MS',
    required: false,
    description: 'Login rate-limit window in milliseconds (default: 60000)',
    validate: (v) => !isNaN(Number(v)) && Number(v) > 0,
    validationError: 'LOGIN_RATE_WINDOW_MS must be a positive integer',
  },
  {
    name: 'CHAT_RATE_LIMIT',
    required: false,
    description: 'Max AI chat messages per window (default: 20)',
    validate: (v) => !isNaN(Number(v)) && Number(v) > 0,
    validationError: 'CHAT_RATE_LIMIT must be a positive integer',
  },
  {
    name: 'CHAT_RATE_WINDOW_MS',
    required: false,
    description: 'Chat rate-limit window in milliseconds (default: 60000)',
    validate: (v) => !isNaN(Number(v)) && Number(v) > 0,
    validationError: 'CHAT_RATE_WINDOW_MS must be a positive integer',
  },
  // ── Personalisation identifiers ───────────────────────────────────────────
  { name: 'RECIPIENT_NAME',    required: false, description: 'Display name of the recipient shown in the UI and AI prompt' },
  { name: 'SENDER_NAME',       required: false, description: 'Display name of the sender used in the AI system prompt' },
  { name: 'RECIPIENT_MEMORY',  required: false, description: 'A short shared memory shown on the home page' },
  { name: 'SENDER_MESSAGE',    required: false, description: 'A short personal message shown on the home page' },
  { name: 'OPENAI_CHAT_MODEL', required: false, description: 'OpenAI model to use for chat (default: gpt-4o-mini)' },
  // ── AI chat personalization ────────────────────────────────────────────────
  { name: 'CHAT_RELATIONSHIP_LENGTH', required: false, description: 'How long the relationship lasted (fills AI system prompt)' },
  { name: 'CHAT_BREAKUP_TIMEFRAME',   required: false, description: 'When the breakup happened (fills AI system prompt)' },
  { name: 'CHAT_BREAKUP_REASON',      required: false, description: 'Why the breakup happened (fills AI system prompt)' },
  { name: 'CHAT_WHAT_SHE_MEANS',      required: false, description: 'What she means to sender (fills AI system prompt)' },
  { name: 'CHAT_MEMORY_1',            required: false, description: 'Shared memory 1 (fills AI system prompt)' },
  { name: 'CHAT_MEMORY_2',            required: false, description: 'Shared memory 2 (fills AI system prompt)' },
  { name: 'CHAT_MEMORY_3',            required: false, description: 'Shared memory 3 (fills AI system prompt)' },
  { name: 'CHAT_MEMORY_4',            required: false, description: 'Shared memory 4 (fills AI system prompt)' },
  { name: 'CHAT_MEMORY_5',            required: false, description: 'Shared memory 5 (fills AI system prompt)' },
  { name: 'CHAT_WANT_HER_TO_KNOW_1',  required: false, description: 'Thing 1 sender wants her to know (fills AI system prompt)' },
  { name: 'CHAT_WANT_HER_TO_KNOW_2',  required: false, description: 'Thing 2 sender wants her to know (fills AI system prompt)' },
  { name: 'CHAT_WANT_HER_TO_KNOW_3',  required: false, description: 'Thing 3 sender wants her to know (fills AI system prompt)' },
  // ── Logging ────────────────────────────────────────────────────────────────
  {
    name: 'LOG_LEVEL',
    required: false,
    description: 'Minimum log level (error|warn|info|debug). Defaults to info in production, debug in development.',
    validate: (v) => ['error', 'warn', 'info', 'debug'].includes(v.toLowerCase()),
    validationError: 'LOG_LEVEL must be one of: error, warn, info, debug',
  },
  {
    name: 'LOG_JSON',
    required: false,
    description: 'Set to "1" to force JSON-structured log output (automatically enabled in production).',
  },
];

export interface EnvValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

export function validateEnv(): EnvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const isProd = process.env.NODE_ENV === 'production';

  for (const spec of ENV_SCHEMA) {
    const value = process.env[spec.name];

    if (!value) {
      if (spec.required) {
        const message = `${spec.name} is required — ${spec.description}`;
        if (isProd) {
          errors.push(message);
        } else {
          warnings.push(message);
        }
      } else if (isProd) {
        warnings.push(`${spec.name} not set — ${spec.description}`);
      }
      continue;
    }

    if (spec.validate && !spec.validate(value)) {
      if (isProd) {
        errors.push(spec.validationError ?? `${spec.name} failed validation`);
      } else {
        warnings.push(spec.validationError ?? `${spec.name} failed validation`);
      }
    }
  }

  return { ok: errors.length === 0, errors, warnings };
}

/**
 * Call this at the top of any server-side file that needs env vars.
 * Throws in production if critical vars are missing.
 * Logs warnings in development.
 */
export function requireEnv(): void {
  const result = validateEnv();

  if (result.warnings.length > 0) {
    for (const w of result.warnings) {
      console.warn(`[env] ⚠️  ${w}`);
    }
  }

  if (!result.ok) {
    const msg = `Environment misconfigured:\n${result.errors.map((e) => `  ✗ ${e}`).join('\n')}`;
    if (process.env.NODE_ENV === 'production') {
      throw new Error(msg);
    } else {
      console.error(`[env] ${msg}`);
    }
  }
}
