import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/config/entorno', () => ({
  obtenerBatchBaseUrl: vi.fn(),
}));

vi.mock('@/app/api/_lib/proxy', () => ({
  buildProxyHeaders: vi.fn(),
  forwardResponse: vi.fn(),
  invalidJsonBody: vi.fn(),
  invalidPayload: vi.fn(),
  requireAdminAccess: vi.fn(),
  upstreamUnavailable: vi.fn(),
}));

import { obtenerBatchBaseUrl } from '@/lib/config/entorno';
import {
  buildProxyHeaders,
  forwardResponse,
  invalidJsonBody,
  invalidPayload,
  requireAdminAccess,
  upstreamUnavailable,
} from '@/app/api/_lib/proxy';

import { POST } from './route';

const mockedObtenerBatchBaseUrl = vi.mocked(obtenerBatchBaseUrl);
const mockedBuildProxyHeaders = vi.mocked(buildProxyHeaders);
const mockedForwardResponse = vi.mocked(forwardResponse);
const mockedInvalidJsonBody = vi.mocked(invalidJsonBody);
const mockedInvalidPayload = vi.mocked(invalidPayload);
const mockedRequireAdminAccess = vi.mocked(requireAdminAccess);
const mockedUpstreamUnavailable = vi.mocked(upstreamUnavailable);

describe('api/admin/nomina/periods POST', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedObtenerBatchBaseUrl.mockReturnValue('http://batch.local');
    mockedBuildProxyHeaders.mockReturnValue(new Headers({ accept: 'application/json' }));
    mockedForwardResponse.mockResolvedValue(new Response('forwarded', { status: 201 }));
    mockedInvalidJsonBody.mockReturnValue(new Response('invalid-json', { status: 400 }));
    mockedInvalidPayload.mockReturnValue(new Response('invalid-payload', { status: 400 }));
    mockedUpstreamUnavailable.mockReturnValue(new Response('unavailable', { status: 502 }));
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 201,
        headers: { 'content-type': 'application/json' },
      })
    );
  });

  it('returns the authorization response when admin access is denied', async () => {
    mockedRequireAdminAccess.mockResolvedValueOnce(new Response('forbidden', { status: 403 }));

    const response = await POST(new Request('http://localhost/api/admin/nomina/periods'));

    expect(response.status).toBe(403);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('returns an invalid-json response when the body cannot be parsed', async () => {
    mockedRequireAdminAccess.mockResolvedValueOnce(null);

    const request = {
      headers: new Headers(),
      json: vi.fn().mockRejectedValue(new Error('bad-json')),
    } as unknown as Request;

    const response = await POST(request);

    expect(mockedInvalidJsonBody).toHaveBeenCalledWith('Body invalido');
    expect(response.status).toBe(400);
  });

  it('returns an invalid-payload response when the body is incomplete', async () => {
    mockedRequireAdminAccess.mockResolvedValueOnce(null);

    const request = new Request('http://localhost/api/admin/nomina/periods', {
      method: 'POST',
      body: JSON.stringify({ anio: 2026 }),
      headers: { 'content-type': 'application/json' },
    });

    const response = await POST(request);

    expect(mockedInvalidPayload).toHaveBeenCalledWith('Payload invalido');
    expect(response.status).toBe(400);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('forwards valid requests to the batch service', async () => {
    mockedRequireAdminAccess.mockResolvedValueOnce(null);

    const payload = {
      anio: 2026,
      quincena: 3,
      fechaInicio: '2026-02-01',
      fechaFin: '2026-02-15',
      fechaPagoEstimada: '2026-02-20',
    };

    const request = new Request('http://localhost/api/admin/nomina/periods', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'content-type': 'application/json',
        cookie: 'iam_session=abc',
      },
    });

    const response = await POST(request);

    expect(mockedBuildProxyHeaders).toHaveBeenCalledWith({
      req: request,
      withJsonContentType: true,
    });
    expect(global.fetch).toHaveBeenCalledWith(
      'http://batch.local/api/admin/nomina/periods',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(payload),
        cache: 'no-store',
      })
    );
    expect(mockedForwardResponse).toHaveBeenCalled();
    expect(response.status).toBe(201);
  });

  it('maps fetch failures to the upstream-unavailable helper', async () => {
    mockedRequireAdminAccess.mockResolvedValueOnce(null);
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('network-down'));

    const request = new Request('http://localhost/api/admin/nomina/periods', {
      method: 'POST',
      body: JSON.stringify({
        anio: 2026,
        quincena: 3,
        fechaInicio: '2026-02-01',
        fechaFin: '2026-02-15',
        fechaPagoEstimada: '2026-02-20',
      }),
      headers: { 'content-type': 'application/json' },
    });

    const response = await POST(request);

    expect(mockedUpstreamUnavailable).toHaveBeenCalledWith(
      'BATCH',
      expect.any(Error)
    );
    expect(response.status).toBe(502);
  });
});
