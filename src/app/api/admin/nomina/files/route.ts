import { obtenerBatchBaseUrl } from '@/lib/config/entorno';
import {
  buildProxyHeaders,
  copySearchParams,
  forwardResponse,
  requireAdminAccess,
  upstreamUnavailable,
} from '@/app/api/_lib/proxy';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  const forbidden = await requireAdminAccess(req);
  if (forbidden) {
    return forbidden;
  }

  const baseUrl = obtenerBatchBaseUrl();

  try {
    const sourceUrl = new URL(req.url);
    const targetUrl = new URL(`${baseUrl}/api/admin/nomina/files`);
    copySearchParams(sourceUrl, targetUrl, ['versionId']);

    const upstream = await fetch(targetUrl, {
      method: 'GET',
      headers: buildProxyHeaders({ req }),
      cache: 'no-store',
    });

    return forwardResponse(upstream);
  } catch (error) {
    return upstreamUnavailable('BATCH', error);
  }
}
