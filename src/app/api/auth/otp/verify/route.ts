import { NextResponse } from 'next/server';

import { upstreamUnavailable } from '@/app/api/_lib/proxy';
import { obtenerIamBaseUrl } from '@/lib/config/entorno';

export const dynamic = 'force-dynamic';

type VerifyOtpReq = {
  usernameOrEmail: string;
  purpose: string;
  otp: string;
};

function isVerifyOtpReq(value: unknown): value is VerifyOtpReq {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.usernameOrEmail === 'string' &&
    candidate.usernameOrEmail.trim().length > 0 &&
    typeof candidate.purpose === 'string' &&
    candidate.purpose.trim().length > 0 &&
    typeof candidate.otp === 'string' &&
    candidate.otp.trim().length >= 4
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

  if (!isVerifyOtpReq(payload)) {
    return NextResponse.json({ message: 'Payload invalido' }, { status: 400 });
  }

  try {
    const upstream = await fetch(`${base}/auth/otp/verify`, {
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
