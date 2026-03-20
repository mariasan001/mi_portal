export type PeriodoNominaDto = {
  periodId: number;
  anio: number;
  quincena: number;
  periodoCode: string;
  fechaInicio: string;
  fechaFin: string;
  fechaPagoEstimada: string;
};

export type CrearPeriodoNominaPayload = {
  anio: number;
  quincena: number;
  fechaInicio: string;
  fechaFin: string;
  fechaPagoEstimada: string;
};