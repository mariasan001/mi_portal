import { obtenerIamBaseUrl } from '@/lib/config/entorno';
import {
  buildProxyHeaders,
  forwardResponse,
  upstreamUnavailable,
} from '@/app/api/_lib/proxy';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  const baseUrl = obtenerIamBaseUrl();

  try {
    const upstream = await fetch(`${baseUrl}/auth/me`, {
      method: 'GET',
      headers: buildProxyHeaders({ req }),
      cache: 'no-store',
    });

    return forwardResponse(upstream, { forwardSetCookie: true });
  } catch (error) {
    return upstreamUnavailable('IAM', error);
  }
}
