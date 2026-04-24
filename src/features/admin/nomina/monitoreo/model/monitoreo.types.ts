export type NominaPeriodoEstadoDto = {
  periodStateId: number;
  payPeriodId: number;
  periodCode: string;
  anio: number;
  quincena: number;
  currentPreviaVersionId: number;
  currentIntegradaVersionId: number;
  previaLoaded: boolean;
  integradaLoaded: boolean;
  catalogLoaded: boolean;
  validated: boolean;
  released: boolean;
  releasedAt: string | null;
  releasedByUserId: number | null;
  hasCancellations: boolean;
  hasReexpeditions: boolean;
};
