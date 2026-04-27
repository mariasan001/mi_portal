import { obtenerBatchBaseUrl } from '@/lib/config/entorno';
import {
  buildProxyHeaders,
  forwardResponse,
  invalidJsonBody,
  invalidPayload,
  requireAdminAccess,
  upstreamUnavailable,
} from '@/app/api/_lib/proxy';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type CrearVersionNominaPayload = {
  payPeriodId: number;
  stage: 'PREVIA' | 'INTEGRADA';
  notes: string;
  createdByUserId: number;
};

function isCrearVersionNominaPayload(
  value: unknown
): value is CrearVersionNominaPayload {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const body = value as Record<string, unknown>;

  return (
    typeof body.payPeriodId === 'number' &&
    Number.isFinite(body.payPeriodId) &&
    typeof body.stage === 'string' &&
    (body.stage === 'PREVIA' || body.stage === 'INTEGRADA') &&
    typeof body.notes === 'string' &&
    typeof body.createdByUserId === 'number' &&
    Number.isFinite(body.createdByUserId)
  );
}

export async function POST(req: Request) {
  const forbidden = await requireAdminAccess(req);
  if (forbidden) {
    return forbidden;
  }

  const baseUrl = obtenerBatchBaseUrl();

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return invalidJsonBody('Body invalido');
  }

  if (!isCrearVersionNominaPayload(payload)) {
    return invalidPayload('Payload invalido');
  }

  try {
    const upstream = await fetch(`${baseUrl}/api/admin/nomina/versions`, {
      method: 'POST',
      headers: buildProxyHeaders({ req, withJsonContentType: true }),
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    return forwardResponse(upstream);
  } catch (error) {
    return upstreamUnavailable('BATCH', error);
  }
}
