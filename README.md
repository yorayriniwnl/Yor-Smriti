## Yor Smriti

**Dedicated to the person I love, Keyrin.(Fictional Character)**
Live Demo: https://yor-smriti.vercel.app/login

```bash
Username=yorayrin
Password=yorayrin
```

Yor Smriti is a cinematic, interactive apology and memory web experience built with Next.js.
It combines narrative screens, motion-heavy transitions, and custom stage flows across multiple routes
like landing, login, message, panda, and director experiences.

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Framer Motion
- Tailwind CSS

## Run Locally

1. Install dependencies and start the dev server:

```bash
npm install && npm run dev
```

2. Open:

```text
http://localhost:3000
```

3. Configure login credentials in a local env file before testing login:

Create `.env.local` in the project root:

You can change these values to anything you want.

## Login Credentials

Login is validated by `POST /api/login` using environment variables.

- Preferred server-side variables:
	- `APP_USERNAME`
	- `APP_PASSWORD`
- Fallback variables supported by the route:
	- `NEXT_PUBLIC_APP_USERNAME`
	- `NEXT_PUBLIC_APP_PASSWORD`

If credentials are missing, the login API returns a configuration error.

## Deployment Notes

### Vercel (Recommended)

1. Import the repository into Vercel.
2. Set environment variables in Project Settings -> Environment Variables:
	 - `APP_USERNAME`
	 - `APP_PASSWORD`
3. Deploy.

Default Next.js settings work out of the box:

- Install command: `npm install`
- Build command: `npm run build`
- Start command: `npm start`

### Other Platforms

For any Node hosting provider:

1. Set the same environment variables (`APP_USERNAME`, `APP_PASSWORD`).
2. Build with `npm run build`.
3. Run with `npm start`.

Without login env vars, authentication will fail in production.
