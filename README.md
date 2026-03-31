---

## Tech Stack

- **Next.js (App Router)**
- **React + TypeScript**
- **Framer Motion**
- **Tailwind CSS**

---

## Run Locally

### 1. Install dependencies

```bash
npm install
2. Start development server
npm run dev
3. Open in browser
http://localhost:3000
Environment Setup

Before testing login, create a .env.local file in the root:

APP_USERNAME=yorayrin
APP_PASSWORD=yorayrin

You can change these values as needed.

Authentication System

Login is handled via:

POST /api/login
Primary Variables (Recommended)
APP_USERNAME
APP_PASSWORD
Fallback Variables
NEXT_PUBLIC_APP_USERNAME
NEXT_PUBLIC_APP_PASSWORD

If credentials are not configured, the API will return a configuration error.

Deployment
Vercel (Recommended)
Import the repository into Vercel
Go to Project Settings → Environment Variables
Add:
APP_USERNAME=your_value
APP_PASSWORD=your_value
Deploy
Default Build Settings
Install: npm install
Build: npm run build
Start: npm start
Other Hosting Platforms

For any Node.js hosting provider:

Build
npm run build
Start
npm start

Make sure to configure:

APP_USERNAME
APP_PASSWORD

Without these, authentication will fail in production.

Final Note

This project is a feeling turned into code.
Every transition carries intention.
Every screen holds a memory.

If you’re here… it was meant for you.


If you want, I can upgrade this into a **₹10L brand-level README** with storyte
