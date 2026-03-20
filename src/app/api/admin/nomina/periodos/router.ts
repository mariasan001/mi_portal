import { NextResponse } from 'next/server';
import { obtenerBatchBaseUrl } from '@/lib/config/entorno';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type CrearPeriodoPayload = {
  anio: number;
  quincena: number;
  fechaInicio: string;
  fechaFin: string;
  fechaPagoEstimada: string;
};

function isCrearPeriodoPayload(v: unknown): v is CrearPeriodoPayload {
  if (!v || typeof v !== 'object') return false;

  const o = v as Record<string, unknown>;

  return (
    typeof o.anio === 'number' &&
    Number.isFinite(o.anio) &&
    typeof o.quincena === 'number' &&
    Number.isFinite(o.quincena) &&
    typeof o.fechaInicio === 'string' &&
    o.fechaInicio.trim().length > 0 &&
    typeof o.fechaFin === 'string' &&
    o.fechaFin.trim().length > 0 &&
    typeof o.fechaPagoEstimada === 'string' &&
    o.fechaPagoEstimada.trim().length > 0
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

  if (!isCrearPeriodoPayload(payload)) {
    return NextResponse.json({ message: 'Payload inválido' }, { status: 400 });
  }

  try {
    const upstream = await fetch(`${base}/api/admin/nomina/periodos`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        cookie,
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const contentType = upstream.headers.get('content-type') ?? 'application/json';
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