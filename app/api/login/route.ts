import { NextResponse } from 'next/server';

interface LoginRequestBody {
  username?: string;
  password?: string;
}

function getConfiguredCredentials() {
  // Only use server-side env vars for credentials (never expose via NEXT_PUBLIC_)
  const username = process.env.APP_USERNAME ?? '';
  const password = process.env.APP_PASSWORD ?? '';
  return { username, password };
}

export async function POST(request: Request) {
  try {
    const { username: configuredUsername, password: configuredPassword } = getConfiguredCredentials();

    if (!configuredUsername || !configuredPassword) {
      // Server is not configured to accept logins safely.
      console.error('Login API misconfigured: APP_USERNAME and APP_PASSWORD must be set.');
      return NextResponse.json({ ok: false, error: 'Server misconfiguration.' }, { status: 500 });
    }

    let body: LoginRequestBody;
    try {
      body = (await request.json()) as LoginRequestBody;
    } catch {
      return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
    }

    const username = typeof body.username === 'string' ? body.username.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!username || !password) {
      return NextResponse.json({ ok: false, error: 'Missing username or password.' }, { status: 400 });
    }

    const isValid = username === configuredUsername && password === configuredPassword;

    if (!isValid) {
      return NextResponse.json({ ok: false, error: 'Invalid credentials.' }, { status: 401 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error('Login API error:', err);
    return NextResponse.json({ ok: false, error: 'Internal server error.' }, { status: 500 });
  }
}
