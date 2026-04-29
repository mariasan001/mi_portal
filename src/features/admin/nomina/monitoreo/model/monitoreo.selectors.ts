import type { PeriodoNominaDto } from '@/features/admin/nomina/shared/model/periodos.types';

import type { NominaPeriodoEstadoDto } from './monitoreo.types';

type PeriodoLike = PeriodoNominaDto & { periodCode?: string | null };

export type MonitoreoTone = 'ok' | 'warn' | 'danger' | 'neutral';

export type MonitoreoOperationItem = {
  label: string;
  hint: string;
  value: boolean;
  tone: MonitoreoTone;
};

function getPeriodoCode(periodo: PeriodoLike) {
  return periodo.periodoCode ?? periodo.periodCode ?? '';
}

export function boolLabel(value: boolean) {
  return value ? 'Si' : 'No';
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

export function formatPeriodoOptionLabel(periodo: PeriodoLike) {
  const code = getPeriodoCode(periodo);
  return code
    ? `${periodo.anio} · Quincena ${periodo.quincena} · ${code}`
    : `${periodo.anio} · Quincena ${periodo.quincena}`;
}

export function matchesPeriodoQuery(periodo: PeriodoLike, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  return [
    getPeriodoCode(periodo),
    String(periodo.anio),
    `quincena ${periodo.quincena}`,
    `q${periodo.quincena}`,
    formatPeriodoOptionLabel(periodo),
  ].some((candidate) => String(candidate).toLowerCase().includes(normalizedQuery));
}

export function getMonitoreoMainStatus(detalle: NominaPeriodoEstadoDto) {
  if (detalle.released) {
    return {
      label: 'Periodo liberado',
      tone: 'ok' as const,
    };
  }

  if (detalle.hasCancellations || detalle.hasReexpeditions) {
    return {
      label: 'Con alertas operativas',
      tone: 'danger' as const,
    };
  }

  if (detalle.validated) {
    return {
      label: 'Periodo validado',
      tone: 'neutral' as const,
    };
  }

  return {
    label: 'Periodo en revision',
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

export function getMonitoreoOperationItems(
  detalle: NominaPeriodoEstadoDto
): MonitoreoOperationItem[] {
  return [
    {
      label: 'Previa cargada',
      hint: 'Archivo de previa disponible para operacion.',
      value: detalle.previaLoaded,
      tone: detalle.previaLoaded ? 'ok' : 'neutral',
    },
    {
      label: 'Integrada cargada',
      hint: 'Version integrada registrada en el periodo.',
      value: detalle.integradaLoaded,
      tone: detalle.integradaLoaded ? 'ok' : 'neutral',
    },
    {
      label: 'Catalogo cargado',
      hint: 'Catalogo base listo para el flujo de nomina.',
      value: detalle.catalogLoaded,
      tone: detalle.catalogLoaded ? 'ok' : 'neutral',
    },
    {
      label: 'Validado',
      hint: 'La validacion operativa del periodo fue completada.',
      value: detalle.validated,
      tone: detalle.validated ? 'ok' : 'neutral',
    },
    {
      label: 'Liberado',
      hint: 'El periodo ya fue liberado para su salida.',
      value: detalle.released,
      tone: detalle.released ? 'ok' : 'neutral',
    },
    {
      label: 'Cancelaciones',
      hint: 'Indica si existen cancelaciones registradas.',
      value: detalle.hasCancellations,
      tone: detalle.hasCancellations ? 'warn' : 'ok',
    },
    {
      label: 'Reexpediciones',
      hint: 'Indica si existen reexpediciones en el periodo.',
      value: detalle.hasReexpeditions,
      tone: detalle.hasReexpeditions ? 'warn' : 'ok',
    },
  ];
}
