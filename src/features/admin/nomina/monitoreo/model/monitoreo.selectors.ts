import type { NominaPeriodoEstadoDto } from './monitoreo.types';

export function boolLabel(value: boolean) {
  return value ? 'Sí' : 'No';
}

export function formatMonitoreoDate(value: string | null) {
  if (!value) return 'Sin fecha registrada';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(parsed);
}

export function formatNullable(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') {
    return 'Sin registro';
  }

  return String(value);
}

export function getMonitoreoMainStatus(detalle: NominaPeriodoEstadoDto) {
  if (detalle.released) {
    return {
      label: 'Período liberado',
      tone: 'ok' as const,
    };
  }

  if (detalle.validated) {
    return {
      label: 'Período validado',
      tone: 'neutral' as const,
    };
  }

  return {
    label: 'Período en revisión',
    tone: 'warn' as const,
  };
}

export function getMonitoreoOperationStats(detalle: NominaPeriodoEstadoDto) {
  const okCount = [
    detalle.previaLoaded,
    detalle.integradaLoaded,
    detalle.catalogLoaded,
    detalle.validated,
    detalle.released,
    !detalle.hasCancellations,
    !detalle.hasReexpeditions,
  ].filter(Boolean).length;

  return {
    okCount,
    total: 7,
  };
}
