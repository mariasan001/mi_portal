import { obtenerBatchBaseUrl } from '@/lib/config/entorno';
import {
  buildProxyHeaders,
  forwardResponse,
  invalidJsonBody,
  invalidParam,
  invalidPayload,
  requireAdminAccess,
  upstreamUnavailable,
} from '@/app/api/_lib/proxy';

type RouteContext = {
  params: Promise<{
    versionId: string;
  }>;
};

type ReleaseBody = {
  releasedByUserId: number;
  comments: string;
};

function isValidBody(value: unknown): value is ReleaseBody {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const body = value as Record<string, unknown>;

  return (
    Number.isFinite(Number(body.releasedByUserId)) &&
    Number(body.releasedByUserId) >= 0 &&
    typeof body.comments === 'string'
  );
}

export async function POST(req: Request, context: RouteContext) {
  const forbidden = await requireAdminAccess(req);
  if (forbidden) {
    return forbidden;
  }

  const { versionId } = await context.params;

  if (!Number.isFinite(Number(versionId)) || Number(versionId) <= 0) {
    return invalidParam('versionId');
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return invalidJsonBody('Body JSON invalido');
  }

  if (!isValidBody(body)) {
    return invalidPayload('Payload invalido para liberar version');
  }

  const baseUrl = obtenerBatchBaseUrl();

  try {
    const upstream = await fetch(
      `${baseUrl}/api/admin/nomina/releases/versions/${encodeURIComponent(versionId)}`,
      {
        method: 'POST',
        headers: buildProxyHeaders({ req, withJsonContentType: true }),
        body: JSON.stringify(body),
        cache: 'no-store',
      }
    );

    return forwardResponse(upstream);
  } catch (error) {
    return upstreamUnavailable('BATCH', error);
  }
}
