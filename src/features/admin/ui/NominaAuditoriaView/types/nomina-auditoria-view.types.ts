export type NominaAuditoriaAction = 'liberaciones' | 'cancelaciones';

export type NominaAuditoriaReleaseFormState = {
  versionId: string;
  payPeriodCode: string;
  stage: string;
};

export type NominaAuditoriaCancellationFormState = {
  receiptId: string;
  claveSp: string;
  payPeriodCode: string;
  receiptPeriodCode: string;
  nominaTipo: string;
};

export type NominaAuditoriaSummaryItem = {
  label: string;
  value: string;
};
