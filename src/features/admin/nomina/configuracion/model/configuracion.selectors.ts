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
  const normalized = String(status ?? '')
    .trim()
    .toUpperCase();

  if (normalized === 'RELEASED') return 'success';
  if (normalized === 'LOADED') return 'info';
  if (normalized === 'FAILED' || normalized === 'ERROR') return 'danger';
  if (normalized === 'PENDING' || normalized === 'PROCESSING') return 'warning';

  return 'muted';
}

export function formatNominaStatusLabel(status?: string | null) {
  const normalized = String(status ?? '')
    .trim()
    .toUpperCase();

  if (normalized === 'RELEASED') return 'Liberada';
  if (normalized === 'LOADED') return 'Cargada';
  if (normalized === 'FAILED' || normalized === 'ERROR') return 'Error';
  if (normalized === 'PENDING') return 'Pendiente';
  if (normalized === 'PROCESSING') return 'En proceso';

  return formatNominaTitle(status);
}

export function formatNominaBool(value: boolean) {
  return value ? 'Sí' : 'No';
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

export function formatNominaDateTimeLong(value?: string | null) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const weekday = new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
  }).format(date);

  const day = new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
  }).format(date);

  const month = new Intl.DateTimeFormat('es-MX', {
    month: 'long',
  }).format(date);

  const time = new Intl.DateTimeFormat('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);

  return `${weekday} ${day} de ${month} - ${time}`;
}

export function getSearchLabel(entity: ConfiguracionEntity) {
  return entity === 'periodo' ? 'Buscar período por ID' : 'Buscar versión por ID';
}

export function getSearchPlaceholder(entity: ConfiguracionEntity) {
  return entity === 'periodo' ? 'Ej. 12' : 'Ej. 15';
}

export function getSearchButtonLabel(entity: ConfiguracionEntity) {
  return entity === 'periodo' ? 'Consultar período' : 'Consultar versión';
}

export function getContentEyebrow(entity: ConfiguracionEntity) {
  return entity === 'periodo' ? 'Período' : 'Versión';
}

export function getContentTitle(
  entity: ConfiguracionEntity,
  mode: 'resultados' | 'crear'
) {
  if (mode === 'resultados') {
    return entity === 'periodo' ? 'Detalle del período' : 'Detalle de la versión';
  }

  return entity === 'periodo' ? 'Crear o recuperar período' : 'Crear versión';
}

export function getDetailDescription(
  entity: ConfiguracionEntity,
  hasRows: boolean
) {
  if (!hasRows) {
    return entity === 'periodo'
      ? 'Cuando existan períodos registrados, aquí podrás revisar el detalle completo del registro activo.'
      : 'Cuando existan versiones registradas, aquí podrás revisar el detalle completo de la versión activa.';
  }

  return entity === 'periodo'
    ? 'La tabla superior te ayuda a comparar períodos y este bloque muestra el registro seleccionado.'
    : 'La tabla superior te ayuda a comparar versiones y este bloque muestra el registro seleccionado.';
}
