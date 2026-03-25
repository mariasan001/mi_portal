import { NextResponse } from 'next/server';
import { obtenerBatchBaseUrl } from '@/lib/config/entorno';

export async function GET(req: Request) {
  const baseUrl = obtenerBatchBaseUrl();
  const cookie = req.headers.get('cookie') ?? '';
  const url = new URL(req.url);

  const claveSp = url.searchParams.get('claveSp');
  const periodCode = url.searchParams.get('periodCode');

  if (!claveSp || !periodCode) {
    return NextResponse.json(
      { message: 'claveSp y periodCode son obligatorios' },
      { status: 400 }
    );
  }

  const upstreamUrl = new URL(
    `${baseUrl}/api/admin/nomina/receipts/by-sp-period`
  );

  upstreamUrl.searchParams.set('claveSp', claveSp);
  upstreamUrl.searchParams.set('periodCode', periodCode);

  const upstream = await fetch(upstreamUrl.toString(), {
    method: 'GET',
    headers: {
      accept: 'application/json',
      cookie,
    },
    cache: 'no-store',
  });

  const contentType = upstream.headers.get('content-type') ?? 'application/json';
  const text = await upstream.text();

  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      'content-type': contentType,
    },
  });
}