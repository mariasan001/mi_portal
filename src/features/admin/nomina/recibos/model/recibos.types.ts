export type RecibosAction = 'snapshots' | 'recibos' | 'sincronizacion';

export type RecibosFormState = {
  versionId: string;
  releasedByUserId: string;
  comments: string;
};

export type RecibosSummaryItem = {
  label: string;
  value: string;
};

export type GenerarSnapshotsResponseDto = {
  versionId: number;
  stage: string;
  spSourceFileId: number;
  plazaSourceFileId: number;
  combinedTaxSourceFileId: number;
  eventosSourceFileId: number;
  gravadoSourceFileId: number;
  spSnapshotCount: number;
  plazaSnapshotCount: number;
};

export type GenerarRecibosResponseDto = {
  versionId: number;
  stage: string;
  receiptsTouched: number;
  revisionsCreated: number;
  taxDetailsCreated: number;
  conceptDetailsCreated: number;
};

export type LiberarVersionPayload = {
  releasedByUserId: number;
  comments: string;
};

export type LiberarVersionResponseDto = {
  versionId: number;
  stage: string;
  released: boolean;
  releasedAt: string;
  revisionsReleased: number;
  receiptsReleased: number;
};

export type CoreSyncResponseDto = {
  versionId: number;
  stage: string;
  sourceFileId: number;
  sourceFileType: string;
  servidorPublicoAffected: number;
  plazaPrincipalAffected: number;
};

export type NominaRecibosStepKey =
  | 'snapshots'
  | 'receipts'
  | 'release'
  | 'core-sync';
