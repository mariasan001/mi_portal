import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/config/entorno', () => ({
  obtenerBatchBaseUrl: vi.fn(),
}));

vi.mock('@/app/api/_lib/proxy', () => ({
  buildProxyHeaders: vi.fn(),
  forwardResponse: vi.fn(),
  invalidParam: vi.fn(),
  requireAdminAccess: vi.fn(),
  upstreamUnavailable: vi.fn(),
}));

import { obtenerBatchBaseUrl } from '@/lib/config/entorno';
import {
  buildProxyHeaders,
  forwardResponse,
  invalidParam,
  requireAdminAccess,
  upstreamUnavailable,
} from '@/app/api/_lib/proxy';

import { POST } from './route';

const mockedObtenerBatchBaseUrl = vi.mocked(obtenerBatchBaseUrl);
const mockedBuildProxyHeaders = vi.mocked(buildProxyHeaders);
const mockedForwardResponse = vi.mocked(forwardResponse);
const mockedInvalidParam = vi.mocked(invalidParam);
const mockedRequireAdminAccess = vi.mocked(requireAdminAccess);
const mockedUpstreamUnavailable = vi.mocked(upstreamUnavailable);

describe('api/admin/nomina/catalog/jobs/run/[fileId] POST', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedObtenerBatchBaseUrl.mockReturnValue('http://batch.local');
    mockedBuildProxyHeaders.mockReturnValue(new Headers({ accept: 'application/json' }));
    mockedForwardResponse.mockResolvedValue(new Response('forwarded', { status: 200 }));
    mockedInvalidParam.mockReturnValue(new Response('invalid-fileId', { status: 400 }));
    mockedUpstreamUnavailable.mockReturnValue(new Response('unavailable', { status: 502 }));
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    );
  });

  it('rejects invalid route params before calling the upstream', async () => {
    mockedRequireAdminAccess.mockResolvedValueOnce(null);

    const response = await POST(new Request('http://localhost'), {
      params: { fileId: 'abc' },
    });

    expect(mockedInvalidParam).toHaveBeenCalledWith('fileId');
    expect(response.status).toBe(400);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('forwards a valid execution request to batch', async () => {
    mockedRequireAdminAccess.mockResolvedValueOnce(null);
    const request = new Request('http://localhost', {
      headers: { cookie: 'iam_session=abc' },
    });

    const response = await POST(request, {
      params: Promise.resolve({ fileId: '18' }),
    });

    expect(mockedBuildProxyHeaders).toHaveBeenCalledWith({ req: request });
    expect(global.fetch).toHaveBeenCalledWith(
      'http://batch.local/api/admin/nomina/catalog/jobs/run/18',
      expect.objectContaining({
        method: 'POST',
        cache: 'no-store',
      })
    );
    expect(response.status).toBe(200);
  });
});
