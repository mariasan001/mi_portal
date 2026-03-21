import { NextResponse } from 'next/server';
import { obtenerBatchBaseUrl } from '@/lib/config/entorno';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Params = { fileId: string };
type Ctx = { params: Params | Promise<Params> };

async function getParams(ctx: Ctx): Promise<Params> {
  const p = ctx.params;
  return typeof (p as { then?: unknown })?.then === 'function'
    ? await (p as Promise<Params>)
    : (p as Params);
}

export async function GET(req: Request, ctx: Ctx) {
  const base = obtenerBatchBaseUrl();
  const cookie = req.headers.get('cookie') ?? '';

  const { fileId } = await getParams(ctx);
  const fileIdNum = Number(fileId);

  if (!Number.isFinite(fileIdNum) || fileIdNum <= 0) {
    return NextResponse.json({ message: 'fileId inválido' }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const limitRaw = searchParams.get('limit');
  const limit =
    limitRaw && Number.isFinite(Number(limitRaw)) ? Number(limitRaw) : 20;

  try {
    const upstream = await fetch(
      `${base}/api/admin/nomina/payroll/preview/${encodeURIComponent(fileId)}?limit=${encodeURIComponent(String(limit))}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          cookie,
        },
        cache: 'no-store',
      }
    );

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