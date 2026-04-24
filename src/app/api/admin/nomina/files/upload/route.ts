import { NextResponse } from 'next/server';
import { obtenerBatchBaseUrl } from '@/lib/config/entorno';
import {
  buildProxyHeaders,
  forwardResponse,
  invalidPayload,
  requireAdminAccess,
  upstreamUnavailable,
} from '@/app/api/_lib/proxy';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const FILE_TYPES = [
  'TCOMP',
  'TCALC',
  'HNCOMADI',
  'HNCOMGRA',
  'COMP',
  'CALC',
  'CONTAGUB',
  'CATALOGO',
] as const;

function isValidFileType(value: string): boolean {
  return FILE_TYPES.includes(value as (typeof FILE_TYPES)[number]);
}

export async function POST(req: Request) {
  const forbidden = await requireAdminAccess(req);
  if (forbidden) {
    return forbidden;
  }

  const baseUrl = obtenerBatchBaseUrl();

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return invalidPayload('FormData invalido');
  }

  const versionId = form.get('versionId');
  const fileType = form.get('fileType');
  const createdByUserId = form.get('createdByUserId');
  const file = form.get('file');

  const versionIdNum = Number(versionId);
  const createdByUserIdNum =
    createdByUserId === null || createdByUserId === ''
      ? undefined
      : Number(createdByUserId);

  if (!Number.isFinite(versionIdNum) || versionIdNum <= 0) {
    return NextResponse.json({ message: 'versionId invalido' }, { status: 400 });
  }

  if (typeof fileType !== 'string' || !isValidFileType(fileType)) {
    return NextResponse.json({ message: 'fileType invalido' }, { status: 400 });
  }

  if (!(file instanceof File) || file.size <= 0) {
    return NextResponse.json({ message: 'Archivo invalido' }, { status: 400 });
  }

  if (
    createdByUserIdNum !== undefined &&
    (!Number.isFinite(createdByUserIdNum) || createdByUserIdNum <= 0)
  ) {
    return NextResponse.json(
      { message: 'createdByUserId invalido' },
      { status: 400 }
    );
  }

  try {
    const upstreamForm = new FormData();
    upstreamForm.set('file', file, file.name);
    upstreamForm.set('versionId', String(versionIdNum));
    upstreamForm.set('fileType', fileType);

    if (createdByUserIdNum !== undefined) {
      upstreamForm.set('createdByUserId', String(createdByUserIdNum));
    }

    const upstream = await fetch(`${baseUrl}/api/admin/nomina/files/upload`, {
      method: 'POST',
      headers: buildProxyHeaders({ req }),
      body: upstreamForm,
      cache: 'no-store',
    });

    return forwardResponse(upstream);
  } catch (error) {
    return upstreamUnavailable('BATCH', error);
  }
}
