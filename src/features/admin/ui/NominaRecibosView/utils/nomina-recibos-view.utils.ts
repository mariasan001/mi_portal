import type { NominaRecibosSummaryItem } from '../types/nomina-recibos-view.types';

export function parsePositiveInt(value: string): number | null {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return Math.trunc(parsed);
}

export function formatBoolean(value: boolean): string {
  return value ? 'Sí' : 'No';
}

export function formatUnknownValue(value: unknown): string {
  if (typeof value === 'boolean') {
    return formatBoolean(value);
  }

  if (value === null || value === undefined || value === '') {
    return '—';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

export function getGeneralFlowStatus(params: {
  snapshotsDone: boolean;
  receiptsDone: boolean;
  releaseDone: boolean;
  coreSyncDone: boolean;
}): string {
  const { snapshotsDone, receiptsDone, releaseDone, coreSyncDone } = params;

  if (releaseDone && coreSyncDone) {
    return 'Liberación completada y sincronización ejecutada.';
  }

  if (releaseDone) {
    return 'La versión ya fue liberada.';
  }

  if (receiptsDone) {
    return 'Los recibos ya fueron generados para la versión seleccionada.';
  }

  if (snapshotsDone) {
    return 'Los snapshots ya fueron generados para la versión seleccionada.';
  }

  if (coreSyncDone) {
    return 'La sincronización a core ya fue ejecutada.';
  }

  return 'Aún no se han ejecutado acciones para esta versión.';
}

export function buildSummary(params: {
  versionId: number | null;
  releasedByUserId: number | null;
  snapshotsDone: boolean;
  receiptsDone: boolean;
  releaseDone: boolean;
  coreSyncDone: boolean;
}): NominaRecibosSummaryItem[] {
  return [
    {
      label: 'Versión objetivo',
      value: params.versionId ? String(params.versionId) : 'No capturada',
    },
    {
      label: 'Liberado por',
      value: params.releasedByUserId
        ? String(params.releasedByUserId)
        : 'No capturado',
    },
    {
      label: 'Snapshots',
      value: params.snapshotsDone ? 'Generados' : 'Pendientes',
    },
    {
      label: 'Recibos',
      value: params.receiptsDone ? 'Generados' : 'Pendientes',
    },
    {
      label: 'Liberación',
      value: params.releaseDone ? 'Completada' : 'Pendiente',
    },
    {
      label: 'Sincronización',
      value: params.coreSyncDone ? 'Ejecutada' : 'Pendiente',
    },
  ];
}