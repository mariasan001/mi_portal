export type NominaStage = 'PREVIA' | 'INTEGRADA';
export type NominaStatus = 'LOADED' | string;

export type VersionNominaDto = {
  versionId: number;
  payPeriodId: number;
  periodCode: string;
  anio?: number;
  quincena?: number;
  stage: NominaStage;
  status: NominaStatus;
  isCurrent: boolean;
  released: boolean;
  validatedAt?: string | null;
  releasedAt?: string | null;
  notes: string;
  loadedAt: string;
  createdAt?: string;
  createdByUserId?: number;
  updatedAt?: string;
  updatedByUserId?: number;
  releasedByUserId?: number | null;
};

export type CrearVersionNominaPayload = {
  payPeriodId: number;
  stage: NominaStage;
  notes: string;
  createdByUserId: number;
};
