import { ApiError, extraerMensaje } from './api.errores';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ApiRequestOptions = Omit<RequestInit, 'method' | 'body'> & {
  method?: HttpMethod;
  body?: unknown;
};

function buildHeaders(h?: HeadersInit): Headers {
  const headers = new Headers(h);
  if (!headers.has('accept')) headers.set('accept', 'application/json');
  return headers;
}

async function readJsonSafe(res: Response): Promise<unknown> {
  const ct = res.headers.get('content-type') ?? '';
  if (!ct.includes('application/json')) return undefined;
  try {
    return await res.json();
  } catch {
    return undefined;
  }
}

export async function request<T>(url: string, opts: ApiRequestOptions = {}): Promise<T> {
  const method: HttpMethod = opts.method ?? 'GET';
  const headers = buildHeaders(opts.headers);

  let body: BodyInit | undefined;
  if (opts.body !== undefined) {
    if (!headers.has('content-type')) headers.set('content-type', 'application/json');
    body = JSON.stringify(opts.body);
  }

  const res = await fetch(url, {
    ...opts,
    method,
    headers,
    body,
    cache: 'no-store',
    credentials: 'include',
  });

  const data = await readJsonSafe(res);

  if (!res.ok) {
    const msg = extraerMensaje(data) ?? `Error HTTP ${res.status}`;
    throw new ApiError({ message: msg, status: res.status, url, payload: data });
  }

  return data as T;
}

export const api = {
  get: <T>(url: string, opts?: Omit<ApiRequestOptions, 'method'>) =>
    request<T>(url, { ...opts, method: 'GET' }),

  post: <T>(url: string, body?: unknown, opts?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    request<T>(url, { ...opts, method: 'POST', body }),
};
