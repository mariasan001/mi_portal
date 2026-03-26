import type { NominaAuditoriaSummaryItem } from '../types/nomina-auditoria-view.types';

export function parseOptionalNumber(value: string): number | undefined {
  if (!value.trim()) {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  return Math.trunc(parsed);
}

export function formatDate(value: string): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('es-MX');
}

export function buildAuditSummary(params: {
  total?: number;
  limit?: number;
  offset?: number;
}): NominaAuditoriaSummaryItem[] {
  return [
    {
      label: 'Total',
      value: String(params.total ?? 0),
    },
    {
      label: 'Límite',
      value: String(params.limit ?? '—'),
    },
    {
      label: 'Offset',
      value: String(params.offset ?? '—'),
    },
  ];
}