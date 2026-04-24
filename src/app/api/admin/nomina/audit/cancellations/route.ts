import { obtenerBatchBaseUrl } from '@/lib/config/entorno';
import {
  buildProxyHeaders,
  copySearchParams,
  forwardResponse,
  requireAdminAccess,
  upstreamUnavailable,
} from '@/app/api/_lib/proxy';

const AUDIT_CANCELLATIONS_QUERY_KEYS = [
  'receiptId',
  'claveSp',
  'payPeriodCode',
  'receiptPeriodCode',
  'nominaTipo',
  'limit',
  'offset',
] as const;

export async function GET(req: Request) {
  const forbidden = await requireAdminAccess(req);
  if (forbidden) {
    return forbidden;
  }

  const requestUrl = new URL(req.url);
  const upstreamUrl = new URL(
    `${obtenerBatchBaseUrl()}/api/admin/nomina/audit/cancellations`
  );
  copySearchParams(requestUrl, upstreamUrl, AUDIT_CANCELLATIONS_QUERY_KEYS);

  try {
    const upstream = await fetch(upstreamUrl.toString(), {
      method: 'GET',
      headers: buildProxyHeaders({ req }),
      cache: 'no-store',
    });

    return forwardResponse(upstream);
  } catch (error) {
    return upstreamUnavailable('BATCH', error);
  }
}
