export type NominaAuditoriaAction = 'liberaciones' | 'cancelaciones';

export type NominaAuditoriaReleaseFormState = {
  versionId: string;
  payPeriodCode: string;
  stage: string;
  limit: string;
  offset: string;
};

export type NominaAuditoriaCancellationFormState = {
  receiptId: string;
  claveSp: string;
  payPeriodCode: string;
  receiptPeriodCode: string;
  nominaTipo: string;
  limit: string;
  offset: string;
};

export type NominaAuditoriaSummaryItem = {
  label: string;
  value: string;
};