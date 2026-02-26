import { NextResponse } from 'next/server';
import { obtenerIamBaseUrl } from '@/lib/config/entorno';

export const dynamic = 'force-dynamic';

type ForgotReq = { email: string };

function isForgotReq(v: unknown): v is ForgotReq {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return typeof o.email === 'string' && o.email.trim().length > 3;
}

export async function POST(req: Request) {
  const base = obtenerIamBaseUrl();

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ message: 'Body inválido' }, { status: 400 });
  }

  if (!isForgotReq(payload)) {
    return NextResponse.json({ message: 'Payload inválido' }, { status: 400 });
  }

  try {
    const upstream = await fetch(`${base}/auth/password/forgot`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const ct = upstream.headers.get('content-type') ?? 'application/json';
    const text = await upstream.text();

    return new NextResponse(text, { status: upstream.status, headers: { 'content-type': ct } });
  } catch (e) {
    return NextResponse.json({ message: 'No se pudo conectar a IAM', error: String(e) }, { status: 502 });
  }
}