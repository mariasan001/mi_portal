import { NextResponse } from 'next/server';
import { obtenerIamBaseUrl } from '@/lib/config/entorno';

export const dynamic = 'force-dynamic';

type LoginRequest = {
  username: string;
  password: string;
  appCode: string;
};

function esLoginRequest(v: unknown): v is LoginRequest {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.username === 'string' &&
    typeof o.password === 'string' &&
    typeof o.appCode === 'string' &&
    o.username.trim().length > 0 &&
    o.password.trim().length > 0 &&
    o.appCode.trim().length > 0
  );
}

export async function POST(req: Request) {
  const base = obtenerIamBaseUrl();

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ message: 'Body inválido' }, { status: 400 });
  }

  if (!esLoginRequest(payload)) {
    return NextResponse.json({ message: 'Payload inválido' }, { status: 400 });
  }

  try {
    const upstream = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const contentType = upstream.headers.get('content-type') ?? 'application/json';
    const text = await upstream.text();

    const res = new NextResponse(text, {
      status: upstream.status,
      headers: { 'content-type': contentType },
    });

    // Reenvío robusto de cookies
    const hdrs = upstream.headers as Headers & { getSetCookie?: () => string[] };
    const cookies = typeof hdrs.getSetCookie === 'function' ? hdrs.getSetCookie() : [];
    if (cookies.length) {
      for (const c of cookies) res.headers.append('set-cookie', c);
    } else {
      const single = upstream.headers.get('set-cookie');
      if (single) res.headers.set('set-cookie', single);
    }

    return res;
  } catch (e) {
    return NextResponse.json({ message: 'No se pudo conectar a IAM', error: String(e) }, { status: 502 });
  }
}
