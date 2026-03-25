import { NextResponse } from 'next/server';
import { obtenerBatchBaseUrl } from '@/lib/config/entorno';

type RouteContext = {
  params: Promise<{
    versionId: string;
  }>;
};

type ReleaseBody = {
  releasedByUserId: number;
  comments: string;
};

function isValidBody(value: unknown): value is ReleaseBody {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const body = value as Record<string, unknown>;

  return (
    Number.isFinite(Number(body.releasedByUserId)) &&
    Number(body.releasedByUserId) >= 0 &&
    typeof body.comments === 'string'
  );
}

export async function POST(req: Request, context: RouteContext) {
  const { versionId } = await context.params;

  if (!Number.isFinite(Number(versionId)) || Number(versionId) <= 0) {
    return NextResponse.json(
      { message: 'versionId inválido' },
      { status: 400 }
    );
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: 'Body JSON inválido' },
      { status: 400 }
    );
  }

  if (!isValidBody(body)) {
    return NextResponse.json(
      { message: 'Payload inválido para liberar versión' },
      { status: 400 }
    );
  }

  const baseUrl = obtenerBatchBaseUrl();
  const cookie = req.headers.get('cookie') ?? '';

  const upstream = await fetch(
    `${baseUrl}/api/admin/nomina/releases/versions/${encodeURIComponent(versionId)}`,
    {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        cookie,
      },
      body: JSON.stringify(body),
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