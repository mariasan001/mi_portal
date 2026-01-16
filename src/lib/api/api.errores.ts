/**
 * Errores tipados para UI.
 */

export type ApiErrorPayload = unknown;

export class ApiError extends Error {
  readonly status: number;
  readonly url?: string;
  readonly payload?: ApiErrorPayload;

  constructor(args: { message: string; status: number; url?: string; payload?: ApiErrorPayload }) {
    super(args.message);
    this.name = 'ApiError';
    this.status = args.status;
    this.url = args.url;
    this.payload = args.payload;
  }
}

export function esApiError(e: unknown): e is ApiError {
  return e instanceof ApiError;
}

export function toErrorMessage(e: unknown, fallback = 'Ocurrió un error'): string {
  if (esApiError(e)) return e.message || fallback;
  if (e instanceof Error) return e.message || fallback;
  if (typeof e === 'string') return e;
  return fallback;
}

export function extraerMensaje(payload: unknown): string | undefined {
  if (!payload || typeof payload !== 'object') return undefined;
  const p = payload as Record<string, unknown>;
  const msg = typeof p.message === 'string' ? p.message : undefined;
  const err = typeof p.error === 'string' ? p.error : undefined;
  return msg || err;
}
