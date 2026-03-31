import { NextResponse } from 'next/server';

interface LoginRequestBody {
  username?: string;
  password?: string;
}

function getConfiguredCredentials() {
  const username = process.env.APP_USERNAME ?? process.env.NEXT_PUBLIC_APP_USERNAME;
  const password = process.env.APP_PASSWORD ?? process.env.NEXT_PUBLIC_APP_PASSWORD;

  return { username, password };
}

export async function POST(request: Request) {
  const { username: configuredUsername, password: configuredPassword } = getConfiguredCredentials();

  if (!configuredUsername || !configuredPassword) {
    return NextResponse.json(
      { ok: false, error: 'Login credentials are not configured on the server.' },
      { status: 500 },
    );
  }

  let body: LoginRequestBody;
  try {
    body = (await request.json()) as LoginRequestBody;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const username = typeof body.username === 'string' ? body.username.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  const isValid =
    username === configuredUsername &&
    password === configuredPassword;

  if (!isValid) {
    return NextResponse.json({ ok: false, error: 'Invalid credentials.' }, { status: 401 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
