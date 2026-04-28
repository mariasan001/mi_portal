import { obtenerBatchBaseUrl } from '@/lib/config/entorno';
import {
  buildProxyHeaders,
  copySearchParams,
  forwardResponse,
  invalidJsonBody,
  invalidPayload,
  requireAdminAccess,
  upstreamUnavailable,
} from '@/app/api/_lib/proxy';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type CrearPeriodoPayload = {
  anio: number;
  quincena: number;
  fechaInicio: string;
  fechaFin: string;
  fechaPagoEstimada: string;
};

function isCrearPeriodoPayload(value: unknown): value is CrearPeriodoPayload {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const body = value as Record<string, unknown>;

  return (
    typeof body.anio === 'number' &&
    Number.isFinite(body.anio) &&
    typeof body.quincena === 'number' &&
    Number.isFinite(body.quincena) &&
    typeof body.fechaInicio === 'string' &&
    body.fechaInicio.trim().length > 0 &&
    typeof body.fechaFin === 'string' &&
    body.fechaFin.trim().length > 0 &&
    typeof body.fechaPagoEstimada === 'string' &&
    body.fechaPagoEstimada.trim().length > 0
  );
}

export async function GET(req: Request) {
  const forbidden = await requireAdminAccess(req);
  if (forbidden) {
    return forbidden;
  }

  const baseUrl = obtenerBatchBaseUrl();

  try {
    const sourceUrl = new URL(req.url);
    const targetUrl = new URL(`${baseUrl}/api/admin/nomina/periods`);
    copySearchParams(sourceUrl, targetUrl, []);

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

  if (!isCrearPeriodoPayload(payload)) {
    return invalidPayload('Payload invalido');
  }

  try {
    const upstream = await fetch(`${baseUrl}/api/admin/nomina/periods`, {
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
