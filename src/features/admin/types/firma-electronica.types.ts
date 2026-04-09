export type SignatureRequestStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SIGNED'
  | 'FAILED';

export type SignatureApiResponse<T> = {
  codigo: string;
  descripcion: string;
  data: T;
};

export type CrearSolicitudFirmaPayload = {
  file: File;
  cuts: string;
  contrasena: string;
  nombre?: string;
  descripcion?: string;
};

export type CrearSolicitudFirmaResultDto = {
  requestId: string;
  status: string;
};

export type SolicitudFirmaListItemDto = {
  requestId: string;
  originalFileName: string;
  status: string;
  providerSignatureId: string;
  requestedAt: string;
  completedAt: string | null;
};

export type SolicitudFirmaDetalleDto = {
  requestId: string;
  originalFileName: string;
  status: string;
  cuts: string;
  documentName: string;
  documentDescription: string;
  providerSignatureId: string;
  errorCode: string | null;
  errorMessage: string | null;
  requestedAt: string;
  startedAt: string | null;
  completedAt: string | null;
};

export type FirmaArchivoDetalleDto = {
  nombreArchivo: string | null;
  mimeType: string | null;
  contenidoBase64: string | null;
};

export type FirmaFirmanteDetalleDto = {
  nombre: string | null;
  correo: string | null;
  organizacion: string | null;
  serieCertificado: string | null;
  vigenciaInicio: string | null;
  vigenciaFin: string | null;
};

export type FirmaAutoridadCertificadoraDetalleDto = {
  nombre: string | null;
  unidadOrganizacional: string | null;
  organizacion: string | null;
};

export type FirmaDetalleTecnicoDto = {
  identificadorFirma: string | null;
  archivo: FirmaArchivoDetalleDto | null;
  firmante: FirmaFirmanteDetalleDto | null;
  autoridadCertificadora?: FirmaAutoridadCertificadoraDetalleDto | null;
  firmaCriptografica?: Record<string, unknown> | null;
  ocsp?: Record<string, unknown> | null;
  tsp?: Record<string, unknown> | null;
};