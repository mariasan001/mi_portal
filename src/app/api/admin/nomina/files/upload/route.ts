import { NextResponse } from 'next/server';
import { obtenerBatchBaseUrl } from '@/lib/config/entorno';

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
  const base = obtenerBatchBaseUrl();
  const cookie = req.headers.get('cookie') ?? '';

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ message: 'FormData inválido' }, { status: 400 });
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
    return NextResponse.json({ message: 'versionId inválido' }, { status: 400 });
  }

  if (typeof fileType !== 'string' || !isValidFileType(fileType)) {
    return NextResponse.json({ message: 'fileType inválido' }, { status: 400 });
  }

  if (!(file instanceof File) || file.size <= 0) {
    return NextResponse.json({ message: 'Archivo inválido' }, { status: 400 });
  }

  if (
    createdByUserIdNum !== undefined &&
    (!Number.isFinite(createdByUserIdNum) || createdByUserIdNum <= 0)
  ) {
    return NextResponse.json(
      { message: 'createdByUserId inválido' },
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

    const upstream = await fetch(`${base}/api/admin/nomina/files/upload`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        cookie,
      },
      body: upstreamForm,
      cache: 'no-store',
    });

    const contentType =
      upstream.headers.get('content-type') ?? 'application/json';
    const text = await upstream.text();

    return new NextResponse(text, {
      status: upstream.status,
      headers: { 'content-type': contentType },
    });
  } catch (e) {
    return NextResponse.json(
      { message: 'No se pudo conectar a BATCH', error: String(e) },
      { status: 502 }
    );
  }
}