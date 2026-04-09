import { api } from '@/lib/api/api.cliente';
import { API_RUTAS } from '@/lib/api/api.rutas';
import type {
  CrearSolicitudFirmaPayload,
  CrearSolicitudFirmaResultDto,
  FirmaDetalleTecnicoDto,
  SignatureApiResponse,
  SignatureRequestStatus,
  SolicitudFirmaDetalleDto,
  SolicitudFirmaListItemDto,
} from '../types/firma-electronica.types';

type UnknownRecord = Record<string, unknown>;

/**
 * Valida si el valor es un objeto plano.
 */
function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}

/**
 * Valida si una respuesta tiene la forma:
 * { codigo, descripcion, data }
 */
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

/**
 * Desempaqueta la respuesta sin importar si viene como:
 * - DTO limpio
 * - wrapper { codigo, descripcion, data }
 * - axiosResponse.data
 * - axiosResponse.data.data
 */
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

/**
 * Imprime en consola la respuesta cruda
 * y también la respuesta ya normalizada.
 */
function debugApiResponse<T>(label: string, response: unknown): T {
  console.group(`📡 ${label}`);
  console.log('RAW RESPONSE:', response);

  try {
    console.log('RAW RESPONSE JSON:', JSON.stringify(response, null, 2));
  } catch {
    console.log('RAW RESPONSE JSON: no se pudo serializar');
  }

  const normalized = unwrapApiResult<T>(response);

  console.log('NORMALIZED RESPONSE:', normalized);

  try {
    console.log(
      'NORMALIZED RESPONSE JSON:',
      JSON.stringify(normalized, null, 2)
    );
  } catch {
    console.log('NORMALIZED RESPONSE JSON: no se pudo serializar');
  }

  console.groupEnd();

  return normalized;
}

/**
 * Construye el FormData requerido por la API
 * para crear una nueva solicitud de firma.
 */
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


/**
 * Crea una solicitud de firma. de a firma encotr
 */
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

  return debugApiResponse<CrearSolicitudFirmaResultDto>(
    'CREAR SOLICITUD FIRMA',
    response
  );
}

/**
 * Obtiene el listado de solicitudes.
 */
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

  return debugApiResponse<SolicitudFirmaListItemDto[]>(
    'LISTADO SOLICITUDES FIRMA',
    response
  );
}

/**
 * Obtiene el detalle operativo de una solicitud.
 */
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

  return debugApiResponse<SolicitudFirmaDetalleDto>(
    `DETALLE SOLICITUD FIRMA - ${requestId}`,
    response
  );
}

/**
 * Obtiene el detalle técnico de una solicitud.
 */

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

  return debugApiResponse<FirmaDetalleTecnicoDto>(
    `DETALLE TECNICO FIRMA - ${requestId}`,
    response
  );
}


/**
 * Descarga el PDF firmado en binario.
 *
 * Regresa el archivo como ArrayBuffer para poder
 * modificarlo en frontend con pdf-lib.
 */
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
        : `No se pudo descargar el PDF firmado. Código ${response.status}.`
    );
  }

  return response.arrayBuffer();
}