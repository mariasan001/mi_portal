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
  nombreArchivo: string;
  mimeType: string;
  contenidoBase64: string;
};

export type FirmaFirmanteDetalleDto = {
  nombre: string;
  correo: string;
  organizacion: string;
  serieCertificado: string;
  vigenciaInicio: string;
  vigenciaFin: string;
};

export type FirmaDetalleTecnicoDto = {
  identificadorFirma: string;
  archivo: FirmaArchivoDetalleDto;
  firmante: FirmaFirmanteDetalleDto;
  autoridadCertificadora: Record<string, unknown>;
  [key: string]: unknown;
};