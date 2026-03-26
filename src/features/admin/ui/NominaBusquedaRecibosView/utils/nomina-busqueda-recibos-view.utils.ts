import type { NominaBusquedaRecibosSummaryItem } from '../types/nomina-busqueda-recibos-view.types';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 2,
  }).format(value ?? 0);
}

export function formatDateTime(value: string): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('es-MX');
}

export function formatDate(value: string): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('es-MX');
}

export function buildSummary(params: {
  claveSp?: string;
  searchedPeriodCode?: string;
  totalReceipts?: number;
}): NominaBusquedaRecibosSummaryItem[] {
  return [
    {
      label: 'Clave SP',
      value: params.claveSp || '—',
    },
    {
      label: 'Periodo buscado',
      value: params.searchedPeriodCode || '—',
    },
    {
      label: 'Total de recibos',
      value: String(params.totalReceipts ?? 0),
    },
  ];
}