import { NextResponse } from 'next/server';
import { obtenerBatchBaseUrl } from '@/lib/config/entorno';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Params = { fileId: string };
type Ctx = { params: Params | Promise<Params> };

console.log('[SUMMARY ROUTE] archivo cargado');

async function getParams(ctx: Ctx): Promise<Params> {
  const p = ctx.params;
  return typeof (p as { then?: unknown })?.then === 'function'
    ? await (p as Promise<Params>)
    : (p as Params);
}

export async function GET(req: Request, ctx: Ctx) {
  console.log('[SUMMARY ROUTE] entrando al GET');

  const base = obtenerBatchBaseUrl();
  const cookie = req.headers.get('cookie') ?? '';

  const { fileId } = await getParams(ctx);
  const fileIdNum = Number(fileId);

  console.log('[SUMMARY ROUTE] base =', base);
  console.log('[SUMMARY ROUTE] fileId =', fileId);

  if (!Number.isFinite(fileIdNum) || fileIdNum <= 0) {
    return NextResponse.json({ message: 'fileId inválido' }, { status: 400 });
  }

  try {
    const upstreamUrl = `${base}/api/admin/nomina/payroll/summary/${encodeURIComponent(
      fileId
    )}`;

    console.log('[SUMMARY ROUTE] upstreamUrl =', upstreamUrl);

    const upstream = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        ...(cookie ? { cookie } : {}),
      },
      cache: 'no-store',
    });

    console.log('[SUMMARY ROUTE] upstream status =', upstream.status);

    const contentType =
      upstream.headers.get('content-type') ?? 'application/json';
    const text = await upstream.text();

    console.log('[SUMMARY ROUTE] upstream body =', text);

    return new NextResponse(text, {
      status: upstream.status,
      headers: { 'content-type': contentType },
    });
  } catch (e) {
    console.error('[SUMMARY ROUTE] error =', e);

    return NextResponse.json(
      { message: 'No se pudo conectar a BATCH', error: String(e) },
      { status: 502 }
    );
  }
}