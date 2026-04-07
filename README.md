## Yor Smriti

Cinematic, private web experiences for apology and reconciliation.

Live demo: https://yor-smriti.vercel.app

Quick start

1. Install dependencies and start the dev server:

```bash
npm install && npm run dev
```

2. Open `http://localhost:3000`

Configuration

Set these server-side environment variables for production:

- `APP_USERNAME`
- `APP_PASSWORD`

Development (local) credentials

Use these demo credentials for local testing only:

```
Username: yorayrin
Password: yorayrin
```

Tech

- Next.js (App Router)
- React + TypeScript
- Framer Motion
- Tailwind CSS

Deployment

Recommended: Vercel. Ensure `APP_USERNAME` and `APP_PASSWORD` are configured in project settings.

Other providers: set the same environment variables, build with `npm run build`, and run with `npm start`.
