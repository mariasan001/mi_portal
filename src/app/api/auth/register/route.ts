import { NextResponse } from 'next/server';
import { obtenerIamBaseUrl } from '@/lib/config/entorno';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  const base = obtenerIamBaseUrl();

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ message: 'Body inválido' }, { status: 400 });
  }

  try {
    const upstream = await fetch(`${base}/auth/register`, {
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

    // ✅ Por si register también setea cookies/sesión
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
    return NextResponse.json(
      { message: 'No se pudo conectar a IAM', error: String(e) },
      { status: 502 }
    );
  }
}