import type { ConfiguracionEntity } from './configuracion.types';

export function formatNominaDate(value: string) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function formatNominaCompactPeriod(
  anio?: number | null,
  quincena?: number | null,
  periodCode?: string | null
) {
  if (typeof anio === 'number' && typeof quincena === 'number') {
    return `${anio} / Q${quincena}`;
  }

  return periodCode || '-';
}

export function formatNominaStatusTone(status?: string | null) {
  const normalized = String(status ?? '').trim().toUpperCase();

  if (normalized === 'RELEASED') return 'success';
  if (normalized === 'LOADED') return 'info';
  if (normalized === 'FAILED' || normalized === 'ERROR') return 'danger';
  if (normalized === 'PENDING' || normalized === 'PROCESSING') return 'warning';

  return 'muted';
}

export function formatNominaStatusLabel(status?: string | null) {
  const normalized = String(status ?? '').trim().toUpperCase();

  if (normalized === 'RELEASED') return 'Liberada';
  if (normalized === 'LOADED') return 'Cargada';
  if (normalized === 'FAILED' || normalized === 'ERROR') return 'Error';
  if (normalized === 'PENDING') return 'Pendiente';
  if (normalized === 'PROCESSING') return 'En proceso';

  return formatNominaTitle(status);
}

export function formatNominaTitle(value?: string | null) {
  if (!value) return '-';

  return String(value)
    .trim()
    .toLowerCase()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getContentEyebrow(entity: ConfiguracionEntity) {
  return entity === 'periodo' ? 'Período' : 'Versión';
}

export function getContentTitle(entity: ConfiguracionEntity) {
  return entity === 'periodo' ? 'Crear o recuperar período' : 'Crear versión';
}
