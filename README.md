## Yor Smriti

Is your girlfriend or wife angry at you ? Or did you had a breakup.
Send them this to show how much you care about them. 
**Dedicated to the person I love, Keyrin.(Fictional Character)**
Live Demo: https://yor-smriti.vercel.app

```bash
Username =yorayrin
Password =yorayrin
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

Login is validated by `POST /api/login`.

By default, the app accepts these demo credentials:

```bash
Username =yorayrin
Password =yorayrin
```

You can override them with environment variables.

- Preferred server-side variables:
	- `APP_USERNAME`
	- `APP_PASSWORD`
- Fallback variables supported by the route:
	- `NEXT_PUBLIC_APP_USERNAME`
	- `NEXT_PUBLIC_APP_PASSWORD`

If no environment variables are set, the built-in demo credentials above are used.

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
