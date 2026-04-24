import { obtenerBatchBaseUrl } from '@/lib/config/entorno';
import {
  buildProxyHeaders,
  forwardResponse,
  invalidParam,
  requireAdminAccess,
  resolveRouteParams,
  upstreamUnavailable,
} from '@/app/api/_lib/proxy';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type RouteContext = {
  params: Promise<{
    versionId: string;
  }>;
};

export async function POST(req: Request, context: RouteContext) {
  const forbidden = await requireAdminAccess(req);
  if (forbidden) {
    return forbidden;
  }

  const { versionId } = await resolveRouteParams(context.params);

  if (!Number.isFinite(Number(versionId)) || Number(versionId) <= 0) {
    return invalidParam('versionId');
  }

  try {
    const upstream = await fetch(
      `${obtenerBatchBaseUrl()}/api/admin/nomina/core-sync/versions/${encodeURIComponent(versionId)}`,
      {
        method: 'POST',
        headers: buildProxyHeaders({ req }),
        cache: 'no-store',
      }
    );

    return forwardResponse(upstream);
  } catch (error) {
    return upstreamUnavailable('BATCH', error);
  }
}
