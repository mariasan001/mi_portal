import type {
  NominaRecibosStepStatus,
  NominaRecibosSummaryItem,
} from '../types/nomina-recibos-view.types';

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

export function getStepStatusLabel(status: NominaRecibosStepStatus): string {
  switch (status) {
    case 'success':
      return 'Completado';
    case 'ready':
      return 'Listo';
    case 'blocked':
      return 'Bloqueado';
    case 'running':
      return 'Procesando';
    default:
      return 'Pendiente';
  }
}

export function getGeneralFlowStatus(params: {
  snapshotsDone: boolean;
  receiptsDone: boolean;
  releaseDone: boolean;
  coreSyncDone: boolean;
}): string {
  const { snapshotsDone, receiptsDone, releaseDone, coreSyncDone } = params;

  if (releaseDone && coreSyncDone) {
    return 'Flujo principal completado y sincronización complementaria ejecutada.';
  }

  if (releaseDone) {
    return 'Flujo principal completado.';
  }

  if (snapshotsDone || receiptsDone || coreSyncDone) {
    return 'Hay avance parcial en la sesión.';
  }

  return 'Aún no se han ejecutado acciones.';
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
      label: 'Sync core',
      value: params.coreSyncDone ? 'Ejecutada' : 'Pendiente',
    },
  ];
}