# Deployment & Environment

This project requires a few environment variables for production. Create a `.env.local` or set environment variables in your hosting provider.

Required / recommended variables

- `OPENAI_API_KEY` — API key for OpenAI (if chat features are used).
- `APP_USERNAME` / `APP_PASSWORD` — Optional simple credentials for `/api/login` (use a strong password in prod).
- `REDIS_URL` — Optional but recommended: a Redis connection string (e.g. `redis://:password@host:6379/0`). When set, the rate limiter will use Redis for counters; otherwise an in-memory fallback is used (not suitable for multi-instance production).
- `LOGIN_RATE_LIMIT`, `LOGIN_RATE_WINDOW_MS` — Numeric overrides for login rate limiting (defaults: `5`, `60000`).
- `CHAT_RATE_LIMIT`, `CHAT_RATE_WINDOW_MS` — Numeric overrides for chat rate limiting (defaults: `20`, `60000`).

Notes

- If you deploy multiple instances (Vercel, Cloud Run, etc.), configure `REDIS_URL` so rate-limiting is shared across instances.
- The in-memory fallback is only safe for single-instance setups or development.
- For Redis, use a managed provider (e.g., Upstash for serverless, Redis Cloud, AWS Elasticache) and set `REDIS_URL` securely in your deployment environment.

Quick start (local)

1. Copy `.env.example` to `.env.local` and fill values.
2. Install dependencies and build:

```bash
npm install
npm run build
npm run start
```

Monitoring & Troubleshooting

- The rate limiter logs minimal connection state and errors to server logs (`[rateLimiter] Redis connected`, `Redis error`).
- If you see `Redis error` messages, ensure your `REDIS_URL` is correct and accessible from your deployment environment.
