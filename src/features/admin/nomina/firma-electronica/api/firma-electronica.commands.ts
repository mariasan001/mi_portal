import type {
  CrearSolicitudFirmaPayload,
  CrearSolicitudFirmaResultDto,
  FirmaDetalleTecnicoDto,
  SignatureApiResponse,
  SignatureRequestStatus,
  SolicitudFirmaDetalleDto,
  SolicitudFirmaListItemDto,
} from '@/features/admin/nomina/firma-electronica/model/firma-electronica.types';
import { api } from '@/lib/api/api.cliente';
import { API_RUTAS } from '@/lib/api/api.routes';

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}

function isSignatureApiResponse<T>(
  value: unknown
): value is SignatureApiResponse<T> {
  return (
    isRecord(value) &&
    'codigo' in value &&
    'descripcion' in value &&
    'data' in value
  );
}

function unwrapApiResult<T>(response: unknown): T {
  if (isSignatureApiResponse<T>(response)) {
    return response.data;
  }

  if (isRecord(response) && 'data' in response) {
    const firstLevel = response.data;

    if (isSignatureApiResponse<T>(firstLevel)) {
      return firstLevel.data;
    }

    return firstLevel as T;
  }

  return response as T;
}

function buildCrearSolicitudFormData(
  payload: CrearSolicitudFirmaPayload
): FormData {
  const form = new FormData();

  form.append('file', payload.file);
  form.append('cuts', payload.cuts);
  form.append('contrasena', payload.contrasena);

  if (payload.nombre?.trim()) {
    form.append('nombre', payload.nombre.trim());
  }

  if (payload.descripcion?.trim()) {
    form.append('descripcion', payload.descripcion.trim());
  }

  return form;
}

export async function crearSolicitudFirma(
  payload: CrearSolicitudFirmaPayload,
  opts?: { signal?: AbortSignal }
): Promise<CrearSolicitudFirmaResultDto> {
  const formData = buildCrearSolicitudFormData(payload);

  const response = await api.post(
    API_RUTAS.firmaElectronica.solicitudes,
    formData,
    {
      signal: opts?.signal,
    }
  );

  return unwrapApiResult<CrearSolicitudFirmaResultDto>(response);
}

export async function listarSolicitudesFirma(
  status?: SignatureRequestStatus,
  opts?: { signal?: AbortSignal }
): Promise<SolicitudFirmaListItemDto[]> {
  const qs = status ? `?status=${encodeURIComponent(status)}` : '';

  const response = await api.get(
    `${API_RUTAS.firmaElectronica.solicitudes}${qs}`,
    {
      signal: opts?.signal,
    }
  );

  return unwrapApiResult<SolicitudFirmaListItemDto[]>(response);
}

export async function obtenerDetalleSolicitudFirma(
  requestId: string,
  opts?: { signal?: AbortSignal }
): Promise<SolicitudFirmaDetalleDto> {
  const response = await api.get(
    API_RUTAS.firmaElectronica.detalleSolicitud(requestId),
    {
      signal: opts?.signal,
    }
  );

  return unwrapApiResult<SolicitudFirmaDetalleDto>(response);
}

export async function obtenerDetalleTecnicoFirma(
  requestId: string,
  opts?: { signal?: AbortSignal }
): Promise<FirmaDetalleTecnicoDto> {
  const response = await api.get(
    API_RUTAS.firmaElectronica.detalleFirma(requestId),
    {
      signal: opts?.signal,
    }
  );

  return unwrapApiResult<FirmaDetalleTecnicoDto>(response);
}

export async function descargarPdfFirmado(
  requestId: string,
  opts?: { signal?: AbortSignal }
): Promise<ArrayBuffer> {
  const response = await fetch(API_RUTAS.firmaElectronica.signedPdf(requestId), {
    method: 'GET',
    signal: opts?.signal,
    headers: {
      Accept: 'application/pdf',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    let detail = '';

    try {
      detail = await response.text();
    } catch {
      detail = '';
    }

    throw new Error(
      detail?.trim()
        ? `No se pudo descargar el PDF firmado. ${detail}`
        : `No se pudo descargar el PDF firmado. Codigo ${response.status}.`
    );
  }

  return response.arrayBuffer();
}
