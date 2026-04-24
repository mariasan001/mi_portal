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

type Params = { payPeriodId: string };
type Ctx = { params: Params | Promise<Params> };

export async function GET(req: Request, ctx: Ctx) {
  const forbidden = await requireAdminAccess(req);
  if (forbidden) {
    return forbidden;
  }

  const { payPeriodId } = await resolveRouteParams(ctx.params);
  const payPeriodIdNum = Number(payPeriodId);

  if (!Number.isFinite(payPeriodIdNum) || payPeriodIdNum <= 0) {
    return invalidParam('payPeriodId');
  }

  try {
    const upstream = await fetch(
      `${obtenerBatchBaseUrl()}/api/admin/nomina/state/period/${encodeURIComponent(String(payPeriodIdNum))}`,
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
