export type NominaStage = 'PREVIA' | 'INTEGRADA';
export type NominaStatus = 'LOADED' | string;

export type VersionNominaDto = {
  versionId: number;
  payPeriodId: number;
  periodCode: string;
  stage: NominaStage;
  status: NominaStatus;
  isCurrent: boolean;
  released: boolean;
  notes: string;
  loadedAt: string;
};

export type CrearVersionNominaPayload = {
  payPeriodId: number;
  stage: NominaStage;
  notes: string;
  createdByUserId: number;
};
