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
  status: SignatureRequestStatus;
};

export type SolicitudFirmaListItemDto = {
  requestId: string;
  originalFileName: string;
  status: SignatureRequestStatus;
  providerSignatureId: string;
  requestedAt: string;
  completedAt: string | null;
};

export type SolicitudFirmaDetalleDto = {
  requestId: string;
  originalFileName: string;
  status: SignatureRequestStatus;
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

export type FirmaCriptograficaDetalleDto = {
  hashAlgoritmoDetectado?: string | null;
  algoritmoFirma?: string | null;
  firmaCrudaBytes?: number | null;
  firmaHex?: string | null;
};

export type FirmaOcspDetalleDto = {
  tipoDetectado?: string | null;
  fechaProduccion?: string | null;
  hashCertConsultado?: string | null;
  serieConsultada?: string | null;
  issuerNameHash?: string | null;
  issuerKeyHash?: string | null;
  thisUpdate?: string | null;
  nonce?: string | null;
};

export type FirmaTspDetalleDto = {
  tipoDetectado?: string | null;
  estado?: string | null;
  hashAlgorithm?: string | null;
  messageImprint?: string | null;
  numeroSerieSello?: string | null;
  fechaSello?: string | null;
  tsa?: string | null;
};

export type FirmaDetalleTecnicoDto = {
  identificadorFirma: string | null;
  archivo: FirmaArchivoDetalleDto | null;
  firmante: FirmaFirmanteDetalleDto | null;
  autoridadCertificadora?: FirmaAutoridadCertificadoraDetalleDto | null;
  firmaCriptografica?: FirmaCriptograficaDetalleDto | null;
  ocsp?: FirmaOcspDetalleDto | null;
  tsp?: FirmaTspDetalleDto | null;
};

export type FirmaSignedPdfResponse = ArrayBuffer;