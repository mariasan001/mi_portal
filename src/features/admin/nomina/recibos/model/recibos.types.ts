import type { VersionNominaDto } from '@/features/admin/nomina/shared/model/versiones.types';

export type RecibosAction =
  | 'snapshots'
  | 'recibos'
  | 'sincronizacion'
  | 'liberacion';

export type RecibosFormState = {
  comments: string;
};

export type RecibosStepStatus = 'blocked' | 'ready' | 'done';

export type RecibosVersionProgress = {
  snapshotsDone: boolean;
  receiptsDone: boolean;
  coreSyncDone: boolean;
  releaseDone: boolean;
  snapshots: Record<string, unknown> | null;
  receipts: Record<string, unknown> | null;
  coreSync: Record<string, unknown> | null;
  release: Record<string, unknown> | null;
};

export type RecibosStepItem = {
  key: RecibosAction;
  label: string;
  description: string;
  status: RecibosStepStatus;
  canExecute: boolean;
};

export type RecibosVersionCardItem = {
  version: VersionNominaDto;
  periodLabel: string;
  subtitle: string;
  statusLabel: string;
  statusTone: string;
  stageLabel: string;
  progressLabel: string;
  progressTone: 'neutral' | 'warn' | 'ok';
  steps: RecibosStepItem[];
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
