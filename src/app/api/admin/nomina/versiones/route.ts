import { NextResponse } from 'next/server';
import { obtenerBatchBaseUrl } from '@/lib/config/entorno';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type CrearVersionNominaPayload = {
  payPeriodId: number;
  stage: 'PREVIA' | 'INTEGRADA';
  notes: string;
  createdByUserId: number;
};

function isCrearVersionNominaPayload(
  v: unknown
): v is CrearVersionNominaPayload {
  if (!v || typeof v !== 'object') return false;

  const o = v as Record<string, unknown>;

  return (
    typeof o.payPeriodId === 'number' &&
    Number.isFinite(o.payPeriodId) &&
    typeof o.stage === 'string' &&
    (o.stage === 'PREVIA' || o.stage === 'INTEGRADA') &&
    typeof o.notes === 'string' &&
    typeof o.createdByUserId === 'number' &&
    Number.isFinite(o.createdByUserId)
  );
}

export async function POST(req: Request) {
  const base = obtenerBatchBaseUrl();
  const cookie = req.headers.get('cookie') ?? '';

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ message: 'Body inválido' }, { status: 400 });
  }

  if (!isCrearVersionNominaPayload(payload)) {
    return NextResponse.json({ message: 'Payload inválido' }, { status: 400 });
  }

  try {
    const upstream = await fetch(`${base}/api/admin/nomina/versions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        cookie,
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const contentType =
      upstream.headers.get('content-type') ?? 'application/json';
    const text = await upstream.text();

    return new NextResponse(text, {
      status: upstream.status,
      headers: { 'content-type': contentType },
    });
  } catch (e) {
    return NextResponse.json(
      { message: 'No se pudo conectar a BATCH', error: String(e) },
      { status: 502 }
    );
  }
}