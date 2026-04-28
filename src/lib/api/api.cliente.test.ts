import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from './api.errors';
import { api, request } from './api.cliente';

describe('api.cliente', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('sends JSON requests with sane defaults and returns parsed data', async () => {
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    );

    const result = await request<{ ok: boolean }>('/api/demo', {
      method: 'POST',
      body: { hello: 'world' },
    });

    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/demo',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ hello: 'world' }),
        cache: 'no-store',
        credentials: 'include',
      })
    );

    const headers = fetchMock.mock.calls[0]?.[1]
      ?.headers as Headers;
    expect(headers.get('accept')).toBe('application/json');
    expect(headers.get('content-type')).toBe('application/json');
  });

  it('does not force a content-type when the body is FormData', async () => {
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ uploaded: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    );

    const body = new FormData();
    body.append('file', new Blob(['demo']), 'demo.txt');

    await api.post('/api/upload', body);

    const headers = fetchMock.mock.calls[0]?.[1]
      ?.headers as Headers;
    expect(headers.get('content-type')).toBeNull();
  });

  it('returns undefined when the response is not JSON', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response('plain text', {
        status: 200,
        headers: { 'content-type': 'text/plain' },
      })
    );

    const result = await request('/api/text');

    expect(result).toBeUndefined();
  });

  it('throws ApiError with backend message when the request fails', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'Fallo controlado' }), {
        status: 422,
        headers: { 'content-type': 'application/json' },
      })
    );

    await expect(request('/api/fail')).rejects.toEqual(
      expect.objectContaining<ApiError>({
        name: 'ApiError',
        message: 'Fallo controlado',
        status: 422,
        url: '/api/fail',
      })
    );
  });

  it('falls back to a generic HTTP error when the payload has no message', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: false }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      })
    );

    await expect(request('/api/fail-500')).rejects.toEqual(
      expect.objectContaining<ApiError>({
        message: 'Error HTTP 500',
        status: 500,
      })
    );
  });
});
