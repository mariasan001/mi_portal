export type BuscarRecibosSpPeriodQuery = {
  claveSp: string;
  periodCode: string;
};

export type ReciboBusquedaHeaderDto = {
  receiptId: number;
  revisionId: number;
  revisionNo: number;
  claveSp: string;
  nombre: string;
  rfc: string;
  nominaTipo: number;
  isReexpedition: boolean;
  sourceNegppa: string;
  payPeriodCode: string;
  receiptPeriodCode: string;
  stage: string;
  totalPercepciones: number;
  totalDeducciones: number;
  neto: number;
  releasedAt: string;
  necche: string;
  necrec: string;
  necsex: string;
  netipi: string;
  plazaPrincipal: string;
  adscripcionPrincipal: string;
  puestoPrincipal: string;
  centroTrabajoPrincipal: string;
  categoriaPrincipal: string;
  cuentaPagadoraPrincipal: string;
  nefocuRaw: string;
  fechaOcupacionInicio: string;
  fechaOcupacionFin: string;
  ocupacionIndefinida: boolean;
};

export type ReciboBusquedaPlazaDto = {
  plaza: string;
  adscripcionId: string;
  adscripcionDesc: string;
  puestoId: string;
  puestoDesc: string;
  centroTrabajoId: string;
  centroTrabajoDesc: string;
  categoria: string;
  cuentaPagadora: string;
  nefocuRaw: string;
  fechaOcupacionInicio: string;
  fechaOcupacionFin: string;
  ocupacionIndefinida: boolean;
  totalPercepciones: number;
  totalDeducciones: number;
  neto: number;
};

export type ReciboBusquedaTaxDetailDto = {
  plaza: string;
  taxBucket: string;
  sourceFileType: string;
  cuentaPagadora: string;
  totalPercepciones: number;
  totalDeducciones: number;
  neto: number;
};

export type ReciboBusquedaConceptDetailDto = {
  plaza: string;
  conceptoId: string;
  conceptoDesc: string;
  conceptoTipo: string;
  importe: number;
  orden: number;
  taxBucket: string;
  sourceFileType: string;
};

export type ReciboBusquedaItemDto = {
  header: ReciboBusquedaHeaderDto;
  plazas: ReciboBusquedaPlazaDto[];
  taxDetails: ReciboBusquedaTaxDetailDto[];
  conceptDetails: ReciboBusquedaConceptDetailDto[];
};

export type BuscarRecibosSpPeriodResponseDto = {
  claveSp: string;
  searchedPeriodCode: string;
  totalReceipts: number;
  receipts: ReciboBusquedaItemDto[];
};
