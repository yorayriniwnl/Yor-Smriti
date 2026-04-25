# 🌸 Yor Smriti

> A cinematic, private apology experience built with elegance, intention, and love.

---

## 🔗 Live

https://yorayriniwnl.in

---

## ⚙️ Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) · React 19 · TypeScript |
| Styling | Tailwind CSS · Framer Motion |
| Auth | Custom JWT (HS256 via `node:crypto`) · HttpOnly cookie |
| AI Chat | OpenAI API (`gpt-4o-mini`) · graceful fallback replies |
| Email | Resend (transactional) · 3,000 free emails/month |
| Rate Limiting | Upstash Redis (serverless) or ioredis or in-memory fallback |
| 3D | Three.js (lazy-loaded) |
| Startup Validation | `instrumentation.ts` → `lib/env.ts` `requireEnv()` |
| Navigation | Persistent sidebar (all pages) · bottom pill nav (home) |
| Hosting | Vercel |

---

## ✨ Experiences

| Route | Description |
|---|---|
| `/` | Home — cinematic hero, 3D heart, AI chat |
| `/message` | Director narrative sequence |
| `/panda` | Apology journey — 8 interactive screens |
| `/love-sorry` | Envelope → cards → letter → playlist → finale |
| `/timeline` | Memory timeline |
| `/reasons` | Why I love you — card deck |
| `/stars` | Our constellation — interactive starfield |
| `/promise` | Promises — commitment cards |
| `/reply` | Meri Anya <3's response form 💌 |
| `/hub` | Experience index |
| `/admin` | Analytics dashboard (auth required) |

---

## 🔌 API Routes

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/login` | — | Authenticate, sets JWT cookie |
| `POST` | `/api/logout` | Cookie | Clears session |
| `GET` | `/api/session` | Cookie | Current session info |
| `POST` | `/api/chat` | Cookie + CSRF | AI chat reply |
| `POST` | `/api/events` | Cookie + CSRF | Experience event tracking |
| `POST` | `/api/reply` | Cookie + CSRF | Meri Anya <3 sends a response |
| `GET` | `/api/config` | Cookie | Personalization config |
| `GET` | `/api/health` | — | Health + config check |
| `GET` | `/api/metrics` | — / Cookie+JSON | Prometheus / JSON metrics |

---

## 🔐 Security

- JWT sessions (HS256, 7-day, `HttpOnly; SameSite=Lax; Secure`)
- Edge middleware guards every non-public route
- CSRF: `x-yor-csrf: 1` custom header required on mutating requests
- Rate limiting: per-IP via Upstash → ioredis → in-memory fallback
- IP extraction: trusts `cf-connecting-ip` → `x-real-ip` → last `X-Forwarded-For`
- Security headers: HSTS, CSP, `X-Frame-Options: DENY`, `nosniff`
- Startup validation: `instrumentation.ts` calls `requireEnv()` at boot

---

## ⚡ Quick Start

```bash
git clone https://github.com/yorayriniwnl/Yor-Smriti
cd Yor-Smriti
cp .env.example .env.local   # fill in your values
npm install
npm run dev
# → http://localhost:3000
```

---

## 🔐 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `AUTH_SECRET` | ✅ prod | JWT signing secret (≥32 chars) |
| `APP_USERNAME` | Recommended | Login username |
| `APP_PASSWORD` | Recommended | Login password |
| `RECIPIENT_NAME` | Optional | Defaults to `Smriti` |
| `SENDER_NAME` | Optional | Defaults to `Ayrin` |
| `RECIPIENT_MEMORY` | Optional | Memory reference line |
| `SENDER_MESSAGE` | Optional | The personal apology message |
| `OPENAI_API_KEY` | Optional | AI chat (falls back to local replies) |
| `RESEND_API_KEY` | Optional | Email (falls back to logging) |
| `NOTIFICATION_EMAIL` | Optional | Admin notification target |
| `SENDER_EMAIL` | Optional | From address for emails |
| `UPSTASH_REDIS_REST_URL` | Optional | Upstash serverless Redis URL |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | Upstash token |
| `REDIS_URL` | Optional | Standard Redis (ioredis) |
| `NEXT_PUBLIC_BASE_URL` | Optional | Canonical URL |

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step setup.

---

## 👤 Author

https://github.com/yorayriniwnl
