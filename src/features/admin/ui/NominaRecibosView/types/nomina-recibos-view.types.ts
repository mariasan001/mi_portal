export type NominaRecibosStepStatus =
  | 'idle'
  | 'ready'
  | 'success'
  | 'blocked'
  | 'running';

export type NominaRecibosStepId =
  | 'snapshots'
  | 'receipts'
  | 'release'
  | 'coreSync';

export type NominaRecibosFlowItem = {
  id: NominaRecibosStepId;
  step: string;
  title: string;
  description: string;
  helper?: string;
  status: NominaRecibosStepStatus;
  disabled: boolean;
  loading: boolean;
  error: string | null;
  onRun: () => void;
};

export type NominaRecibosFormState = {
  versionId: string;
  releasedByUserId: string;
  comments: string;
};

export type NominaRecibosSummaryItem = {
  label: string;
  value: string;
};