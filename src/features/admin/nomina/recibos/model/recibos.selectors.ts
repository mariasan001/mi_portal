import {
  formatNominaCompactPeriod,
  formatNominaStatusLabel,
  formatNominaStatusTone,
  formatNominaTitle,
} from '@/features/admin/nomina/configuracion/model/configuracion.selectors';
import type { VersionNominaDto } from '@/features/admin/nomina/shared/model/versiones.types';

import type {
  RecibosAction,
  RecibosStepItem,
  RecibosVersionCardItem,
  RecibosVersionProgress,
} from './recibos.types';
export function formatBoolean(value: boolean): string {
  return value ? 'Si' : 'No';
}

export function formatUnknownValue(value: unknown): string {
  if (typeof value === 'boolean') {
    return formatBoolean(value);
  }

  if (value === null || value === undefined || value === '') {
    return '-';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

export function createInitialProgress(
  version?: Pick<VersionNominaDto, 'released'> | null
): RecibosVersionProgress {
  const releaseDone = Boolean(version?.released);

  return {
    snapshotsDone: releaseDone,
    receiptsDone: releaseDone,
    coreSyncDone: releaseDone,
    releaseDone,
    snapshots: null,
    receipts: null,
    coreSync: null,
    release: null,
  };
}

export function getStepStatusSummary(progress: RecibosVersionProgress) {
  if (progress.releaseDone) {
    return { label: 'Liberada', tone: 'ok' as const };
  }

  if (progress.coreSyncDone) {
    return { label: 'Lista para liberar', tone: 'warn' as const };
  }

  if (progress.receiptsDone) {
    return { label: 'Lista para sincronizar', tone: 'warn' as const };
  }

  if (progress.snapshotsDone) {
    return { label: 'Lista para recibos', tone: 'warn' as const };
  }

  return { label: 'Nueva', tone: 'neutral' as const };
}

export function buildStepItems(params: {
  progress: RecibosVersionProgress;
  releaseFormReady: boolean;
}): RecibosStepItem[] {
  const { progress, releaseFormReady } = params;

  return [
    {
      key: 'snapshots',
      label: 'Snapshots',
      description: 'Genera snapshots consolidados para la version seleccionada.',
      status: progress.snapshotsDone ? 'done' : 'ready',
      canExecute: !progress.snapshotsDone,
    },
    {
      key: 'recibos',
      label: 'Recibos',
      description: 'Construye recibos a partir de snapshots previamente generados.',
      status: progress.receiptsDone
        ? 'done'
        : progress.snapshotsDone
          ? 'ready'
          : 'blocked',
      canExecute: progress.snapshotsDone && !progress.receiptsDone,
    },
    {
      key: 'sincronizacion',
      label: 'Sincronizacion',
      description: 'Ejecuta la sincronizacion complementaria a core.',
      status: progress.coreSyncDone
        ? 'done'
        : progress.receiptsDone
          ? 'ready'
          : 'blocked',
      canExecute: progress.receiptsDone && !progress.coreSyncDone,
    },
    {
      key: 'liberacion',
      label: 'Liberacion',
      description: 'Libera la version una vez concluido el flujo tecnico.',
      status: progress.releaseDone
        ? 'done'
        : progress.coreSyncDone
          ? 'ready'
          : 'blocked',
      canExecute: progress.coreSyncDone && !progress.releaseDone && releaseFormReady,
    },
  ];
}

export function getNextAction(progress: RecibosVersionProgress): RecibosAction {
  if (!progress.snapshotsDone) return 'snapshots';
  if (!progress.receiptsDone) return 'recibos';
  if (!progress.coreSyncDone) return 'sincronizacion';
  return 'liberacion';
}

export function buildVersionCardItems(params: {
  versions: VersionNominaDto[];
  progressByVersionId: Record<number, RecibosVersionProgress>;
  releaseFormReady: boolean;
}): RecibosVersionCardItem[] {
  const { versions, progressByVersionId, releaseFormReady } = params;

  return versions.map((version) => {
    const progress =
      progressByVersionId[version.versionId] ?? createInitialProgress(version);
    const progressSummary = getStepStatusSummary(progress);

    return {
      version,
      periodLabel: formatNominaCompactPeriod(
        version.anio,
        version.quincena,
        version.periodCode
      ),
      subtitle:
        typeof version.anio === 'number' && typeof version.quincena === 'number'
          ? `${version.anio} · Quincena ${version.quincena} · ${formatNominaTitle(
              version.stage
            )}`
          : `${version.periodCode} · ${formatNominaTitle(version.stage)}`,
      statusLabel: formatNominaStatusLabel(version.status),
      statusTone: formatNominaStatusTone(version.status),
      stageLabel: formatNominaTitle(version.stage),
      progressLabel: progressSummary.label,
      progressTone: progressSummary.tone,
      steps: buildStepItems({ progress, releaseFormReady }),
    };
  });
}
