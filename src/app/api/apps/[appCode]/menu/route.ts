import { NextResponse } from 'next/server';
import { obtenerIamBaseUrl } from '@/lib/config/entorno';

export const dynamic = 'force-dynamic';

type Ctx = { params: { appCode: string } };

export async function GET(req: Request, ctx: Ctx) {
  const base = obtenerIamBaseUrl();
  const cookie = req.headers.get('cookie') ?? '';
  const appCode = ctx.params.appCode;

  try {
    const upstream = await fetch(`${base}/api/v1/apps/${encodeURIComponent(appCode)}/menu`, {
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
    return NextResponse.json({ message: 'No se pudo conectar a IAM', error: String(e) }, { status: 502 });
  }
}
