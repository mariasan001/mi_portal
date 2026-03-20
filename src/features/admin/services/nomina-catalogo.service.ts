import { API_RUTAS } from '@/lib/api/api.rutas';
import { ApiError, extraerMensaje } from '@/lib/api/api.errores';
import type {
  ArchivoNominaDto,
  EjecucionCatalogoDto,
  UploadArchivoNominaPayload,
} from '../types/nomina-catalogo.types';

async function readJsonSafe(res: Response): Promise<unknown> {
  const ct = res.headers.get('content-type') ?? '';
  if (!ct.includes('application/json')) return undefined;

  try {
    return await res.json();
  } catch {
    return undefined;
  }
}

export async function subirArchivoNomina(
  payload: UploadArchivoNominaPayload,
  opts?: { signal?: AbortSignal }
): Promise<ArchivoNominaDto> {
  const form = new FormData();
  form.set('versionId', String(payload.versionId));
  form.set('fileType', payload.fileType);
  form.set('file', payload.file, payload.file.name);

  if (payload.createdByUserId !== undefined) {
    form.set('createdByUserId', String(payload.createdByUserId));
  }

  const res = await fetch(API_RUTAS.nomina.uploadArchivo, {
    method: 'POST',
    body: form,
    cache: 'no-store',
    credentials: 'include',
    signal: opts?.signal,
  });

  const data = await readJsonSafe(res);

  if (!res.ok) {
    const msg = extraerMensaje(data) ?? `Error HTTP ${res.status}`;
    throw new ApiError({
      message: msg,
      status: res.status,
      url: API_RUTAS.nomina.uploadArchivo,
      payload: data,
    });
  }

  return data as ArchivoNominaDto;
}

export async function ejecutarCargaCatalogo(
  fileId: number,
  opts?: { signal?: AbortSignal }
): Promise<EjecucionCatalogoDto> {
  const res = await fetch(API_RUTAS.nomina.ejecutarCatalogo(fileId), {
    method: 'POST',
    cache: 'no-store',
    credentials: 'include',
    headers: {
      accept: 'application/json',
    },
    signal: opts?.signal,
  });

  const data = await readJsonSafe(res);

  if (!res.ok) {
    const msg = extraerMensaje(data) ?? `Error HTTP ${res.status}`;
    throw new ApiError({
      message: msg,
      status: res.status,
      url: API_RUTAS.nomina.ejecutarCatalogo(fileId),
      payload: data,
    });
  }

  return data as EjecucionCatalogoDto;
}