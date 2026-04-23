import { NextResponse } from 'next/server';
import { hasSessionCookieHeader } from '@/lib/auth/session';
import { hasAdminAccess } from '@/lib/auth/server';

type ProxyHeadersArgs = {
  req: Request;
  withJsonContentType?: boolean;
  extraHeaders?: HeadersInit;
};

export function requireSession(req: Request) {
  const cookie = req.headers.get('cookie') ?? '';

  if (!hasSessionCookieHeader(cookie)) {
    return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
  }

  return null;
}

export async function requireAdminAccess(req: Request) {
  const unauthorized = requireSession(req);
  if (unauthorized) {
    return unauthorized;
  }

  const cookie = req.headers.get('cookie') ?? '';
  const hasAccess = await hasAdminAccess(cookie);

  if (!hasAccess) {
    return NextResponse.json({ message: 'Sin permisos para acceder a admin' }, { status: 403 });
  }

  return null;
}

export function buildProxyHeaders({
  req,
  withJsonContentType = false,
  extraHeaders,
}: ProxyHeadersArgs): Headers {
  const headers = new Headers(extraHeaders);
  const cookie = req.headers.get('cookie') ?? '';

  if (!headers.has('accept')) {
    headers.set('accept', 'application/json');
  }

  if (withJsonContentType && !headers.has('content-type')) {
    headers.set('content-type', 'application/json');
  }

  if (cookie && !headers.has('cookie')) {
    headers.set('cookie', cookie);
  }

  return headers;
}

export async function forwardResponse(
  upstream: Response,
  opts?: { forwardSetCookie?: boolean }
) {
  const contentType = upstream.headers.get('content-type') ?? 'application/json';
  const text = await upstream.text();

  const response = new NextResponse(text, {
    status: upstream.status,
    headers: { 'content-type': contentType },
  });

  if (opts?.forwardSetCookie) {
    const headers = upstream.headers as Headers & { getSetCookie?: () => string[] };
    const cookies =
      typeof headers.getSetCookie === 'function' ? headers.getSetCookie() : [];

    if (cookies.length > 0) {
      for (const cookie of cookies) {
        response.headers.append('set-cookie', cookie);
      }
    } else {
      const single = upstream.headers.get('set-cookie');
      if (single) {
        response.headers.set('set-cookie', single);
      }
    }
  }

  return response;
}

export function upstreamUnavailable(serviceName: string, error: unknown) {
  return NextResponse.json(
    {
      message: `No se pudo conectar a ${serviceName}`,
      error: String(error),
    },
    { status: 502 }
  );
}

export function invalidJsonBody(message = 'Body JSON invalido') {
  return NextResponse.json({ message }, { status: 400 });
}

export function invalidPayload(message = 'Payload invalido') {
  return NextResponse.json({ message }, { status: 400 });
}

export function invalidParam(name: string) {
  return NextResponse.json({ message: `${name} invalido` }, { status: 400 });
}

export async function resolveRouteParams<T>(params: T | Promise<T>): Promise<T> {
  return typeof (params as { then?: unknown })?.then === 'function'
    ? await (params as Promise<T>)
    : (params as T);
}

export function copySearchParams(
  sourceUrl: URL,
  targetUrl: URL,
  allowedKeys: readonly string[]
) {
  for (const key of allowedKeys) {
    const value = sourceUrl.searchParams.get(key);
    if (value) {
      targetUrl.searchParams.set(key, value);
    }
  }
}
