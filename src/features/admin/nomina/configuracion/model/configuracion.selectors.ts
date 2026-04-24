import type { ConfiguracionEntity } from './configuracion.types';

export function formatNominaDate(value: string) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function formatNominaBool(value: boolean) {
  return value ? 'Sí' : 'No';
}

export function formatNominaTitle(value?: string | null) {
  if (!value) return '—';

  return String(value)
    .trim()
    .toLowerCase()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatNominaDateTimeLong(value?: string | null) {
  if (!value) return '—';

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

  return `${weekday} ${day} de ${month} · ${time}`;
}

export function getSearchLabel(entity: ConfiguracionEntity) {
  return entity === 'periodo'
    ? 'Buscar período por ID'
    : 'Buscar versión por ID';
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
    return entity === 'periodo'
      ? 'Resultado de consulta'
      : 'Resultado de versión';
  }

  return entity === 'periodo'
    ? 'Crear o recuperar período'
    : 'Crear versión';
}
