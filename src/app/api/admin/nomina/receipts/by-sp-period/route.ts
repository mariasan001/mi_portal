import { NextResponse } from 'next/server';
import { obtenerBatchBaseUrl } from '@/lib/config/entorno';
import {
  buildProxyHeaders,
  forwardResponse,
  requireAdminAccess,
  upstreamUnavailable,
} from '@/app/api/_lib/proxy';

export async function GET(req: Request) {
  const forbidden = await requireAdminAccess(req);
  if (forbidden) {
    return forbidden;
  }

  const baseUrl = obtenerBatchBaseUrl();
  const url = new URL(req.url);
  const claveSp = url.searchParams.get('claveSp');
  const periodCode = url.searchParams.get('periodCode');

  if (!claveSp || !periodCode) {
    return NextResponse.json(
      { message: 'claveSp y periodCode son obligatorios' },
      { status: 400 }
    );
  }

  const upstreamUrl = new URL(`${baseUrl}/api/admin/nomina/receipts/by-sp-period`);
  upstreamUrl.searchParams.set('claveSp', claveSp);
  upstreamUrl.searchParams.set('periodCode', periodCode);

  try {
    const upstream = await fetch(upstreamUrl.toString(), {
      method: 'GET',
      headers: buildProxyHeaders({ req }),
      cache: 'no-store',
    });

    return forwardResponse(upstream);
  } catch (error) {
    return upstreamUnavailable('BATCH', error);
  }
}
