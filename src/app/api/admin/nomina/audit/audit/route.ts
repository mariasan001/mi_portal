import { NextResponse } from 'next/server';
import { obtenerBatchBaseUrl } from '@/lib/config/entorno';

export async function GET(req: Request) {
  const baseUrl = obtenerBatchBaseUrl();
  const cookie = req.headers.get('cookie') ?? '';
  const url = new URL(req.url);

  const upstreamUrl = new URL(`${baseUrl}/api/admin/nomina/audit/releases`);

  const versionId = url.searchParams.get('versionId');
  const payPeriodCode = url.searchParams.get('payPeriodCode');
  const stage = url.searchParams.get('stage');
  const limit = url.searchParams.get('limit');
  const offset = url.searchParams.get('offset');

  if (versionId) upstreamUrl.searchParams.set('versionId', versionId);
  if (payPeriodCode) upstreamUrl.searchParams.set('payPeriodCode', payPeriodCode);
  if (stage) upstreamUrl.searchParams.set('stage', stage);
  if (limit) upstreamUrl.searchParams.set('limit', limit);
  if (offset) upstreamUrl.searchParams.set('offset', offset);

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