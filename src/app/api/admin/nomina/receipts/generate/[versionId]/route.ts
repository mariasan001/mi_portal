import { NextResponse } from 'next/server';
import { obtenerBatchBaseUrl } from '@/lib/config/entorno';

type RouteContext = {
  params: Promise<{
    versionId: string;
  }>;
};

export async function POST(req: Request, context: RouteContext) {
  const { versionId } = await context.params;

  if (!Number.isFinite(Number(versionId)) || Number(versionId) <= 0) {
    return NextResponse.json(
      { message: 'versionId inválido' },
      { status: 400 }
    );
  }

  const baseUrl = obtenerBatchBaseUrl();
  const cookie = req.headers.get('cookie') ?? '';

  const upstream = await fetch(
    `${baseUrl}/api/admin/nomina/receipts/generate/${encodeURIComponent(versionId)}`,
    {
      method: 'POST',
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
    headers: {
      'content-type': contentType,
    },
  });
}