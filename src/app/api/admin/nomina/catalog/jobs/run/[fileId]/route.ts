import { obtenerBatchBaseUrl } from '@/lib/config/entorno';
import {
  buildProxyHeaders,
  forwardResponse,
  invalidParam,
  requireAdminAccess,
  upstreamUnavailable,
} from '@/app/api/_lib/proxy';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Params = { fileId: string };
type Ctx = { params: Params | Promise<Params> };

async function getParams(ctx: Ctx): Promise<Params> {
  const params = ctx.params;
  return typeof (params as { then?: unknown })?.then === 'function'
    ? await (params as Promise<Params>)
    : (params as Params);
}

export async function POST(req: Request, ctx: Ctx) {
  const forbidden = await requireAdminAccess(req);
  if (forbidden) {
    return forbidden;
  }

  const baseUrl = obtenerBatchBaseUrl();
  const { fileId } = await getParams(ctx);
  const fileIdNum = Number(fileId);

  if (!Number.isFinite(fileIdNum) || fileIdNum <= 0) {
    return invalidParam('fileId');
  }

  try {
    const upstream = await fetch(
      `${baseUrl}/api/admin/nomina/catalog/jobs/run/${encodeURIComponent(fileId)}`,
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
