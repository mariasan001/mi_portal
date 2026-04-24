import { obtenerIamBaseUrl } from '@/lib/config/entorno';
import {
  buildProxyHeaders,
  forwardResponse,
  invalidJsonBody,
  invalidPayload,
  upstreamUnavailable,
} from '@/app/api/_lib/proxy';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type LoginRequest = {
  username: string;
  password: string;
  appCode: string;
};

function isLoginRequest(value: unknown): value is LoginRequest {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const body = value as Record<string, unknown>;

  return (
    typeof body.username === 'string' &&
    body.username.trim().length > 0 &&
    typeof body.password === 'string' &&
    body.password.trim().length > 0 &&
    typeof body.appCode === 'string' &&
    body.appCode.trim().length > 0
  );
}

export async function POST(req: Request) {
  const baseUrl = obtenerIamBaseUrl();

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return invalidJsonBody('Body invalido');
  }

  if (!isLoginRequest(payload)) {
    return invalidPayload('Payload invalido');
  }

  try {
    const upstream = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: buildProxyHeaders({ req, withJsonContentType: true }),
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    return forwardResponse(upstream, { forwardSetCookie: true });
  } catch (error) {
    return upstreamUnavailable('IAM', error);
  }
}
