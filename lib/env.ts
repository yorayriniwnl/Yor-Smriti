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
    name: 'NOTIFICATION_EMAIL',
    required: false,
    description: 'Admin email for waitlist + reply notifications',
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
        errors.push(`${spec.name} is required — ${spec.description}`);
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
