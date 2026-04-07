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

export function crearSolicitudFirma(
  payload: CrearSolicitudFirmaPayload,
  opts?: { signal?: AbortSignal }
) {
  const formData = buildCrearSolicitudFormData(payload);

  return api.post<SignatureApiResponse<CrearSolicitudFirmaResultDto>>(
    API_RUTAS.firmaElectronica.solicitudes,
    formData,
    {
      signal: opts?.signal,
    }
  );
}

export function listarSolicitudesFirma(
  status?: SignatureRequestStatus,
  opts?: { signal?: AbortSignal }
) {
  const qs = status ? `?status=${encodeURIComponent(status)}` : '';

  return api.get<SignatureApiResponse<SolicitudFirmaListItemDto[]>>(
    `${API_RUTAS.firmaElectronica.solicitudes}${qs}`,
    {
      signal: opts?.signal,
    }
  );
}

export function obtenerDetalleSolicitudFirma(
  requestId: string,
  opts?: { signal?: AbortSignal }
) {
  return api.get<SignatureApiResponse<SolicitudFirmaDetalleDto>>(
    API_RUTAS.firmaElectronica.detalleSolicitud(requestId),
    {
      signal: opts?.signal,
    }
  );
}

export function obtenerDetalleTecnicoFirma(
  requestId: string,
  opts?: { signal?: AbortSignal }
) {
  return api.get<SignatureApiResponse<FirmaDetalleTecnicoDto>>(
    API_RUTAS.firmaElectronica.detalleFirma(requestId),
    {
      signal: opts?.signal,
    }
  );
}