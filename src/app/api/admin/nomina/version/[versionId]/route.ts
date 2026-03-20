import { NextResponse } from 'next/server';
import { obtenerBatchBaseUrl } from '@/lib/config/entorno';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Params = { versionId: string };
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

  const { versionId } = await getParams(ctx);

  if (!versionId?.trim()) {
    return NextResponse.json({ message: 'Falta versionId en la ruta' }, { status: 400 });
  }

  try {
    const upstream = await fetch(
      `${base}/api/admin/nomina/versiones/${encodeURIComponent(versionId)}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          cookie,
        },
        cache: 'no-store',
      }
    );

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