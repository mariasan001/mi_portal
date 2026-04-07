import { NextRequest, NextResponse } from 'next/server';
import { obtenerSignatureBaseUrl } from '@/lib/config/entorno';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ESTATUS_VALIDOS = ['PENDING', 'PROCESSING', 'SIGNED', 'FAILED'] as const;
type SignatureRequestStatus = (typeof ESTATUS_VALIDOS)[number];

function isValidStatus(value: string): value is SignatureRequestStatus {
  return ESTATUS_VALIDOS.includes(value as SignatureRequestStatus);
}

export async function GET(req: NextRequest) {
  const base = obtenerSignatureBaseUrl();
  const cookie = req.headers.get('cookie') ?? '';

  const status = req.nextUrl.searchParams.get('status');
  const qs =
    status && isValidStatus(status)
      ? `?status=${encodeURIComponent(status)}`
      : '';

  try {
    const upstream = await fetch(`${base}/api/v1/signature-requests${qs}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        cookie,
      },
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
      { message: 'No se pudo conectar a SIGNATURE', error: String(e) },
      { status: 502 }
    );
  }
}

export async function POST(req: NextRequest) {
  const base = obtenerSignatureBaseUrl();
  const cookie = req.headers.get('cookie') ?? '';

  let formData: FormData;

  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { message: 'Body multipart/form-data inválido' },
      { status: 400 }
    );
  }

  const file = formData.get('file');
  const cuts = formData.get('cuts');
  const contrasena = formData.get('contrasena');
  const nombre = formData.get('nombre');
  const descripcion = formData.get('descripcion');

  if (!(file instanceof File)) {
    return NextResponse.json(
      { message: 'El archivo es obligatorio' },
      { status: 400 }
    );
  }

  if (typeof cuts !== 'string' || !cuts.trim()) {
    return NextResponse.json(
      { message: 'cuts es obligatorio' },
      { status: 400 }
    );
  }

  if (typeof contrasena !== 'string' || !contrasena.trim()) {
    return NextResponse.json(
      { message: 'contrasena es obligatoria' },
      { status: 400 }
    );
  }

  const upstreamForm = new FormData();
  upstreamForm.append('file', file);
  upstreamForm.append('cuts', cuts.trim());
  upstreamForm.append('contrasena', contrasena.trim());

  if (typeof nombre === 'string' && nombre.trim()) {
    upstreamForm.append('nombre', nombre.trim());
  }

  if (typeof descripcion === 'string' && descripcion.trim()) {
    upstreamForm.append('descripcion', descripcion.trim());
  }

  try {
    const upstream = await fetch(`${base}/api/v1/signature-requests`, {
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
      { message: 'No se pudo conectar a SIGNATURE', error: String(e) },
      { status: 502 }
    );
  }
}