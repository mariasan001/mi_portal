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

type Params = { periodId: string };
type Ctx = { params: Params | Promise<Params> };

export async function GET(req: Request, ctx: Ctx) {
  const forbidden = await requireAdminAccess(req);
  if (forbidden) {
    return forbidden;
  }

  const { periodId } = await resolveRouteParams(ctx.params);
  if (!periodId?.trim()) {
    return invalidParam('periodId');
  }

  try {
    const upstream = await fetch(
      `${obtenerBatchBaseUrl()}/api/admin/nomina/periods/${encodeURIComponent(periodId)}`,
      {
        method: 'GET',
        headers: buildProxyHeaders({ req }),
        cache: 'no-store',
      }
    );

    return forwardResponse(upstream);
  } catch (error) {
    return upstreamUnavailable('BATCH', error);
  }
}
