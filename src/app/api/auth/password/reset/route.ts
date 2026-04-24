import { NextResponse } from 'next/server';

import { upstreamUnavailable } from '@/app/api/_lib/proxy';
import { obtenerIamBaseUrl } from '@/lib/config/entorno';

export const dynamic = 'force-dynamic';

type ResetReq = { email: string; otp: string; newPassword: string };

function isResetReq(value: unknown): value is ResetReq {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.email === 'string' &&
    candidate.email.trim().length > 3 &&
    typeof candidate.otp === 'string' &&
    candidate.otp.trim().length >= 4 &&
    typeof candidate.newPassword === 'string' &&
    candidate.newPassword.trim().length >= 8
  );
}

export async function POST(req: Request) {
  const base = obtenerIamBaseUrl();

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ message: 'Body invalido' }, { status: 400 });
  }

  if (!isResetReq(payload)) {
    return NextResponse.json({ message: 'Payload invalido' }, { status: 400 });
  }

  try {
    const upstream = await fetch(`${base}/auth/password/reset`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const contentType = upstream.headers.get('content-type') ?? 'application/json';
    const text = await upstream.text();

    return new NextResponse(text, {
      status: upstream.status,
      headers: { 'content-type': contentType },
    });
  } catch (error) {
    return upstreamUnavailable('IAM', error);
  }
}
