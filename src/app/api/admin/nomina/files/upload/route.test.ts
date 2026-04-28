import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/config/entorno', () => ({
  obtenerBatchBaseUrl: vi.fn(),
}));

vi.mock('@/app/api/_lib/proxy', () => ({
  buildProxyHeaders: vi.fn(),
  forwardResponse: vi.fn(),
  invalidPayload: vi.fn(),
  requireAdminAccess: vi.fn(),
  upstreamUnavailable: vi.fn(),
}));

import { obtenerBatchBaseUrl } from '@/lib/config/entorno';
import {
  buildProxyHeaders,
  forwardResponse,
  invalidPayload,
  requireAdminAccess,
  upstreamUnavailable,
} from '@/app/api/_lib/proxy';

import { POST } from './route';

const mockedObtenerBatchBaseUrl = vi.mocked(obtenerBatchBaseUrl);
const mockedBuildProxyHeaders = vi.mocked(buildProxyHeaders);
const mockedForwardResponse = vi.mocked(forwardResponse);
const mockedInvalidPayload = vi.mocked(invalidPayload);
const mockedRequireAdminAccess = vi.mocked(requireAdminAccess);
const mockedUpstreamUnavailable = vi.mocked(upstreamUnavailable);

describe('api/admin/nomina/files/upload POST', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedObtenerBatchBaseUrl.mockReturnValue('http://batch.local');
    mockedBuildProxyHeaders.mockReturnValue(new Headers({ accept: 'application/json' }));
    mockedForwardResponse.mockResolvedValue(new Response('forwarded', { status: 201 }));
    mockedInvalidPayload.mockReturnValue(new Response('invalid-form', { status: 400 }));
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

    const response = await POST(new Request('http://localhost/api/admin/nomina/files/upload'));

    expect(response.status).toBe(403);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('returns invalid payload when formData parsing fails', async () => {
    mockedRequireAdminAccess.mockResolvedValueOnce(null);

    const request = {
      formData: vi.fn().mockRejectedValue(new Error('bad-form')),
      headers: new Headers(),
    } as unknown as Request;

    const response = await POST(request);

    expect(mockedInvalidPayload).toHaveBeenCalledWith('FormData invalido');
    expect(response.status).toBe(400);
  });

  it('rejects invalid versionId values before calling the upstream', async () => {
    mockedRequireAdminAccess.mockResolvedValueOnce(null);

    const form = new FormData();
    form.set('versionId', '0');
    form.set('fileType', 'CATALOGO');
    form.set('file', new File(['dbf'], 'catalogo.dbf'));

    const request = {
      formData: vi.fn().mockResolvedValue(form),
      headers: new Headers(),
    } as unknown as Request;

    const response = await POST(request);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ message: 'versionId invalido' });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('forwards valid uploads to batch with a rebuilt FormData body', async () => {
    mockedRequireAdminAccess.mockResolvedValueOnce(null);

    const form = new FormData();
    form.set('versionId', '4');
    form.set('fileType', 'CATALOGO');
    form.set('createdByUserId', '21');
    form.set('file', new File(['dbf'], 'catalogo.dbf'));

    const request = {
      formData: vi.fn().mockResolvedValue(form),
      headers: new Headers({ cookie: 'iam_session=abc' }),
    } as unknown as Request;

    const response = await POST(request);

    expect(mockedBuildProxyHeaders).toHaveBeenCalledWith({ req: request });
    expect(global.fetch).toHaveBeenCalledWith(
      'http://batch.local/api/admin/nomina/files/upload',
      expect.objectContaining({
        method: 'POST',
        cache: 'no-store',
      })
    );

    const upstreamForm = vi.mocked(global.fetch).mock.calls[0]?.[1]?.body as FormData;
    expect(upstreamForm.get('versionId')).toBe('4');
    expect(upstreamForm.get('fileType')).toBe('CATALOGO');
    expect(upstreamForm.get('createdByUserId')).toBe('21');
    expect(upstreamForm.get('file')).toBeInstanceOf(File);
    expect(response.status).toBe(201);
  });
});
