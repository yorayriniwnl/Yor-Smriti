# Deployment Guide

## Pre-Deploy Checklist

### Security (required)
- [ ] `AUTH_SECRET` — random string ≥32 chars (`node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`)
- [ ] `APP_USERNAME` + `APP_PASSWORD` set (or leave blank for open access)
- [ ] `NEXT_PUBLIC_BASE_URL` set to production domain
- [ ] `TRUST_PROXY=1` — **required on Vercel**. Without this, every request shares the same `"unknown"` rate-limit bucket (one user's burst locks out everyone) and the first-visit email logs `ip=unknown`. Set it in Vercel's Environment Variables dashboard under **Production** scope. Do **not** set it for local development.

### AI Chat (recommended)
- [ ] `OPENAI_API_KEY` from https://platform.openai.com/api-keys
- [ ] Test: `GET /api/health` → `"openai": true`

### Email Notifications (recommended)
- [ ] Sign up at https://resend.com (free: 3,000 emails/month)
- [ ] Add domain or use `@resend.dev` sandbox
- [ ] Set `RESEND_API_KEY=re_...`
- [ ] Set `SENDER_EMAIL=Yor Smriti <noreply@your-domain.com>`
- [ ] Set `NOTIFICATION_EMAIL=your@email.com`

### Redis Rate Limiting (recommended for production)
#### Option A — Upstash (serverless, best for Vercel):
1. https://console.upstash.com → Create Redis database
2. Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
3. Test: `GET /api/health` → `"redis": { "available": true, "type": "upstash" }`

#### Option B — Standard Redis:
1. Set `REDIS_URL=redis://:password@host:6379/0`

### Personalization
- [ ] `RECIPIENT_NAME`, `SENDER_NAME` set
- [ ] `RECIPIENT_MEMORY`, `SENDER_MESSAGE` customized

---

## Vercel Settings
- Node.js version: **20.x**
- Framework: **Next.js** (auto-detected)
- Environment: **Production**
- Required GitHub secret for the deploy workflow: `AUTH_SECRET`

---

## Health Check
```
GET https://your-domain.vercel.app/api/health
```
Expected healthy response:
```json
{
  "ok": true,
  "uptimeSec": 42,
  "version": "1.0.0",
  "config": {
    "authSecret": true,
    "openai": true,
    "appCredentials": true,
    "recipientConfigured": true,
    "email": true,
    "redis": true
  },
  "redis": { "available": true, "pong": "PONG", "type": "upstash" }
}
```

---

## Analytics
- Dashboard: `/admin` (login required)
- Prometheus metrics: `GET /api/metrics`
- JSON metrics: `GET /api/metrics` with `Accept: application/json` + session cookie

---

## CI/CD
GitHub Actions runs two workflows:

**`.github/workflows/ci.yml`** — runs on every push and pull request:
1. `npm ci`
2. `npm run lint`
3. `npm run type-check`
4. `npm run build`

**`.github/workflows/vercel-env-sync.yml`** — triggers on pushes to `main` and deploys to Vercel production using `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` secrets.
- It syncs the configured GitHub secrets/vars into Vercel before deploy.
- It fails fast if `AUTH_SECRET` is missing or too short.
- Leave `APP_USERNAME` and `APP_PASSWORD` both blank for open access, or set both for a gated experience.

---

## Notes on npm dependencies

The following packages are deliberately **not** in `package.json`:

| Package | Reason |
|---|---|
| `resend` | `lib/email.ts` uses the Resend REST API via `fetch()` directly — no SDK needed |
| `@upstash/redis` | `lib/db.ts` and `lib/rateLimiter.ts` use the Upstash REST API via `fetch()` directly |

This keeps the install lean and compatible with all Next.js runtimes (Edge, Node.js, Serverless).
