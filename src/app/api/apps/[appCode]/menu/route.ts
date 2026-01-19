import { NextResponse } from 'next/server';
import { obtenerIamBaseUrl } from '@/lib/config/entorno';

export const dynamic = 'force-dynamic';

type Params = { appCode: string };
type Ctx = { params: Params | Promise<Params> };

async function getParams(ctx: Ctx): Promise<Params> {
  const p = ctx.params;
  // compatible con Promise o objeto
  return typeof (p as { then?: unknown })?.then === 'function' ? await (p as Promise<Params>) : (p as Params);
}

export async function GET(req: Request, ctx: Ctx) {
  const base = obtenerIamBaseUrl();
  const cookie = req.headers.get('cookie') ?? '';

  const { appCode } = await getParams(ctx);

  if (!appCode?.trim()) {
    return NextResponse.json({ message: 'Falta appCode en la ruta' }, { status: 400 });
  }

  const upstreamUrl = `${base}/api/v1/apps/${encodeURIComponent(appCode)}/menu`;

  try {
    const upstream = await fetch(upstreamUrl, {
      method: 'GET',
      headers: { accept: 'application/json', cookie },
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
      { message: 'No se pudo conectar a IAM', error: String(e), upstreamUrl },
      { status: 502 }
    );
  }
}
