import { NextResponse } from 'next/server';
import { obtenerBatchBaseUrl } from '@/lib/config/entorno';

export async function GET(req: Request) {
  const baseUrl = obtenerBatchBaseUrl();
  const cookie = req.headers.get('cookie') ?? '';
  const url = new URL(req.url);

  const upstreamUrl = new URL(`${baseUrl}/api/admin/nomina/audit/cancellations`);

  const receiptId = url.searchParams.get('receiptId');
  const claveSp = url.searchParams.get('claveSp');
  const payPeriodCode = url.searchParams.get('payPeriodCode');
  const receiptPeriodCode = url.searchParams.get('receiptPeriodCode');
  const nominaTipo = url.searchParams.get('nominaTipo');
  const limit = url.searchParams.get('limit');
  const offset = url.searchParams.get('offset');

  if (receiptId) upstreamUrl.searchParams.set('receiptId', receiptId);
  if (claveSp) upstreamUrl.searchParams.set('claveSp', claveSp);
  if (payPeriodCode) upstreamUrl.searchParams.set('payPeriodCode', payPeriodCode);
  if (receiptPeriodCode) upstreamUrl.searchParams.set('receiptPeriodCode', receiptPeriodCode);
  if (nominaTipo) upstreamUrl.searchParams.set('nominaTipo', nominaTipo);
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