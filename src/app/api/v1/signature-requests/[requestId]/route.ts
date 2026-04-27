import { NextResponse } from 'next/server';

import { upstreamUnavailable } from '@/app/api/_lib/proxy';
import { obtenerSignatureBaseUrl } from '@/lib/config/entorno';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  req: Request,
  context: { params: Promise<{ requestId: string }> }
) {
  const base = obtenerSignatureBaseUrl();
  const cookie = req.headers.get('cookie') ?? '';
  const { requestId } = await context.params;

  try {
    const upstream = await fetch(
      `${base}/api/v1/signature-requests/${encodeURIComponent(requestId)}`,
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
  } catch (error) {
    return upstreamUnavailable('SIGNATURE', error);
  }
}
