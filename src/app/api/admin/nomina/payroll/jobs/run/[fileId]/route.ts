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

type Params = { fileId: string };
type Ctx = { params: Params | Promise<Params> };

export async function POST(req: Request, ctx: Ctx) {
  const forbidden = await requireAdminAccess(req);
  if (forbidden) {
    return forbidden;
  }

  const { fileId } = await resolveRouteParams(ctx.params);
  const fileIdNum = Number(fileId);

  if (!Number.isFinite(fileIdNum) || fileIdNum <= 0) {
    return invalidParam('fileId');
  }

  try {
    const upstream = await fetch(
      `${obtenerBatchBaseUrl()}/api/admin/nomina/payroll/jobs/run/${encodeURIComponent(fileId)}`,
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
