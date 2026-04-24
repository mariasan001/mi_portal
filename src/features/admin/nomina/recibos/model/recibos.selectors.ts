import type { RecibosSummaryItem } from './recibos.types';

export function parsePositiveInt(value: string): number | null {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return Math.trunc(parsed);
}

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

export function getGeneralFlowStatus(params: {
  snapshotsDone: boolean;
  receiptsDone: boolean;
  releaseDone: boolean;
  coreSyncDone: boolean;
}): string {
  const { snapshotsDone, receiptsDone, releaseDone, coreSyncDone } = params;

  if (releaseDone && coreSyncDone) {
    return 'La version ya fue sincronizada y ademas cuenta con una liberacion registrada.';
  }

  if (coreSyncDone) {
    return 'La sincronizacion a core ya fue ejecutada para esta version.';
  }

  if (receiptsDone) {
    return 'Los recibos ya fueron generados para la version seleccionada.';
  }

  if (snapshotsDone) {
    return 'Los snapshots ya fueron generados para la version seleccionada.';
  }

  if (releaseDone) {
    return 'La version ya fue liberada.';
  }

  return 'Aun no se han ejecutado acciones para esta version.';
}

export function buildSummary(params: {
  versionId: number | null;
  releasedByUserId: number | null;
  snapshotsDone: boolean;
  receiptsDone: boolean;
  releaseDone: boolean;
  coreSyncDone: boolean;
}): RecibosSummaryItem[] {
  return [
    {
      label: 'Version objetivo',
      value: params.versionId ? String(params.versionId) : 'No capturada',
    },
    {
      label: 'Liberado por',
      value: params.releasedByUserId ? String(params.releasedByUserId) : 'No capturado',
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
      label: 'Sincronizacion',
      value: params.coreSyncDone ? 'Ejecutada' : 'Pendiente',
    },
    {
      label: 'Liberacion',
      value: params.releaseDone ? 'Completada' : 'Pendiente',
    },
  ];
}
