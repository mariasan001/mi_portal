import { NextResponse } from 'next/server';
import { obtenerIamBaseUrl } from '@/lib/config/entorno';

export const dynamic = 'force-dynamic';

type VerifyOtpReq = {
  usernameOrEmail: string;
  purpose: string; // PASSWORD_RESET | LOGIN_2FA
  otp: string;
};

function isVerifyOtpReq(v: unknown): v is VerifyOtpReq {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.usernameOrEmail === 'string' &&
    o.usernameOrEmail.trim().length > 0 &&
    typeof o.purpose === 'string' &&
    o.purpose.trim().length > 0 &&
    typeof o.otp === 'string' &&
    o.otp.trim().length >= 4
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

  if (!isVerifyOtpReq(payload)) {
    return NextResponse.json({ message: 'Payload inválido' }, { status: 400 });
  }

  try {
    const upstream = await fetch(`${base}/auth/otp/verify`, {
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