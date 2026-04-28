import { NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth/session', () => ({
  hasSessionCookieHeader: vi.fn(),
}));

vi.mock('@/lib/auth/server', () => ({
  hasAdminAccess: vi.fn(),
}));

import { hasSessionCookieHeader } from '@/lib/auth/session';
import { hasAdminAccess } from '@/lib/auth/server';

import {
  buildProxyHeaders,
  copySearchParams,
  forwardResponse,
  invalidJsonBody,
  invalidParam,
  invalidPayload,
  requireAdminAccess,
  requireSession,
  resolveRouteParams,
  upstreamUnavailable,
} from './proxy';

const mockedHasSessionCookieHeader = vi.mocked(hasSessionCookieHeader);
const mockedHasAdminAccess = vi.mocked(hasAdminAccess);

describe('api/_lib/proxy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects requests without session cookies', async () => {
    mockedHasSessionCookieHeader.mockReturnValue(false);

    const response = requireSession(new Request('http://localhost/api/demo'));

    expect(response?.status).toBe(401);
    await expect(response?.json()).resolves.toEqual({ message: 'No autenticado' });
    expect(response?.headers.get('cache-control')).toBe('no-store, max-age=0');
  });

  it('allows requests with a valid session cookie header', () => {
    mockedHasSessionCookieHeader.mockReturnValue(true);

    const response = requireSession(
      new Request('http://localhost/api/demo', {
        headers: { cookie: 'iam_session=abc' },
      })
    );

    expect(response).toBeNull();
  });

  it('rejects admin access when the session is missing', async () => {
    mockedHasSessionCookieHeader.mockReturnValue(false);

    const response = await requireAdminAccess(new Request('http://localhost/api/demo'));

    expect(response?.status).toBe(401);
    expect(mockedHasAdminAccess).not.toHaveBeenCalled();
  });

  it('rejects admin access when roles are insufficient', async () => {
    mockedHasSessionCookieHeader.mockReturnValue(true);
    mockedHasAdminAccess.mockResolvedValue(false);

    const response = await requireAdminAccess(
      new Request('http://localhost/api/demo', {
        headers: { cookie: 'iam_session=abc' },
      })
    );

    expect(mockedHasAdminAccess).toHaveBeenCalledWith('iam_session=abc');
    expect(response?.status).toBe(403);
    await expect(response?.json()).resolves.toEqual({
      message: 'Sin permisos para acceder a admin',
    });
  });

  it('allows admin access when the server check passes', async () => {
    mockedHasSessionCookieHeader.mockReturnValue(true);
    mockedHasAdminAccess.mockResolvedValue(true);

    const response = await requireAdminAccess(
      new Request('http://localhost/api/demo', {
        headers: { cookie: 'iam_session=abc' },
      })
    );

    expect(response).toBeNull();
  });

  it('builds proxy headers preserving cookies and adding JSON headers when requested', () => {
    const headers = buildProxyHeaders({
      req: new Request('http://localhost/api/demo', {
        headers: { cookie: 'iam_session=abc' },
      }),
      withJsonContentType: true,
      extraHeaders: { 'x-trace-id': 'trace-1' },
    });

    expect(headers.get('accept')).toBe('application/json');
    expect(headers.get('content-type')).toBe('application/json');
    expect(headers.get('cookie')).toBe('iam_session=abc');
    expect(headers.get('x-trace-id')).toBe('trace-1');
  });

  it('forwards upstream content type and set-cookie headers', async () => {
    const upstream = new Response(JSON.stringify({ ok: true }), {
      status: 201,
      headers: {
        'content-type': 'application/json',
        'set-cookie': 'iam_session=abc; Path=/; HttpOnly',
      },
    });

    const response = await forwardResponse(upstream, { forwardSetCookie: true });

    expect(response.status).toBe(201);
    expect(response.headers.get('content-type')).toBe('application/json');
    expect(response.headers.get('set-cookie')).toContain('iam_session=abc');
    await expect(response.json()).resolves.toEqual({ ok: true });
  });

  it('builds standard error responses for invalid payload helpers', async () => {
    const invalidJson = invalidJsonBody();
    const invalidData = invalidPayload();
    const invalidRouteParam = invalidParam('versionId');

    await expect(invalidJson.json()).resolves.toEqual({ message: 'Body JSON invalido' });
    await expect(invalidData.json()).resolves.toEqual({ message: 'Payload invalido' });
    await expect(invalidRouteParam.json()).resolves.toEqual({
      message: 'versionId invalido',
    });
  });

  it('returns a 502 response when the upstream is unavailable', async () => {
    const response = upstreamUnavailable('BATCH', new Error('boom'));

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      message: 'No se pudo conectar a BATCH',
    });
  });

  it('resolves route params whether they arrive sync or async', async () => {
    await expect(resolveRouteParams({ id: 7 })).resolves.toEqual({ id: 7 });
    await expect(resolveRouteParams(Promise.resolve({ id: 8 }))).resolves.toEqual({
      id: 8,
    });
  });

  it('copies only the allowed query params', () => {
    const sourceUrl = new URL('http://localhost/api/demo?payPeriodId=12&other=77');
    const targetUrl = new URL('http://batch/api/demo');

    copySearchParams(sourceUrl, targetUrl, ['payPeriodId']);

    expect(targetUrl.toString()).toBe('http://batch/api/demo?payPeriodId=12');
  });
});
