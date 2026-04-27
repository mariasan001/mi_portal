import { NextResponse } from 'next/server';

import { upstreamUnavailable } from '@/app/api/_lib/proxy';
import { obtenerIamBaseUrl } from '@/lib/config/entorno';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  const base = obtenerIamBaseUrl();

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ message: 'Body invalido' }, { status: 400 });
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

    const response = new NextResponse(text, {
      status: upstream.status,
      headers: { 'content-type': contentType },
    });

    // Forward cookies too in case register also creates a session.
    const headers = upstream.headers as Headers & { getSetCookie?: () => string[] };
    const cookies =
      typeof headers.getSetCookie === 'function' ? headers.getSetCookie() : [];

    if (cookies.length > 0) {
      for (const cookie of cookies) {
        response.headers.append('set-cookie', cookie);
      }
    } else {
      const singleCookie = upstream.headers.get('set-cookie');
      if (singleCookie) {
        response.headers.set('set-cookie', singleCookie);
      }
    }

    return response;
  } catch (error) {
    return upstreamUnavailable('IAM', error);
  }
}
