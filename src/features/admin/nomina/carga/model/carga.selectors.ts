import type { NominaCargaEntity } from './carga.types';

export function getToolbarSearchLabel(entity: NominaCargaEntity) {
  return entity === 'catalogo'
    ? 'Buscar catálogo por fileId'
    : 'Buscar nómina por fileId';
}

export function getToolbarSearchPlaceholder(entity: NominaCargaEntity) {
  return entity === 'catalogo' ? 'Ej. 125' : 'Ej. 240';
}

export function getToolbarPrimaryLabel(entity: NominaCargaEntity) {
  return entity === 'catalogo' ? 'Nuevo catálogo' : 'Nuevo archivo';
}

export function getContentEyebrow(entity: NominaCargaEntity) {
  return entity === 'catalogo' ? 'Carga de catálogo' : 'Carga de nómina';
}

export function getContentTitle(entity: NominaCargaEntity) {
  return entity === 'catalogo'
    ? 'Resultado del archivo y su ejecución'
    : 'Resultado del staging de nómina';
}

export function getEmptyTitle(entity: NominaCargaEntity) {
  return entity === 'catalogo'
    ? 'Sin actividad todavía'
    : 'Sin ejecución todavía';
}

export function getEmptyDescription(entity: NominaCargaEntity) {
  return entity === 'catalogo'
    ? 'Sube un nuevo archivo de catálogo o ejecuta manualmente uno existente mediante su fileId.'
    : 'Sube un archivo de nómina o ejecuta manualmente un staging mediante un fileId registrado.';
}

export function formatNominaDateTime(value?: string | null) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function formatBytes(value?: number | null) {
  if (!value || value <= 0) return '—';

  const units = ['B', 'KB', 'MB', 'GB'];
  let size = value;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  const decimals = size >= 10 ? 0 : 1;
  return `${size.toFixed(decimals)} ${units[unitIndex]}`;
}

export function formatNominaTitle(value?: string | null) {
  if (!value) return '—';

  return value
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function formatNominaStatusLabel(value?: string | null) {
  switch ((value ?? '').toUpperCase()) {
    case 'PROCESSED':
      return 'Procesado';
    case 'FAILED':
    case 'ERROR':
      return 'Error';
    case 'UPLOADED':
      return 'Cargado';
    case 'PROCESSING':
      return 'En proceso';
    case 'PENDING':
      return 'Pendiente';
    default:
      return formatNominaTitle(value);
  }
}

export function getNominaStatusTone(value?: string | null) {
  switch ((value ?? '').toUpperCase()) {
    case 'PROCESSED':
      return 'success';
    case 'FAILED':
    case 'ERROR':
      return 'danger';
    case 'PROCESSING':
      return 'info';
    case 'UPLOADED':
    case 'PENDING':
    default:
      return 'neutral';
  }
}

export function formatPeriodCodeLabel(value?: string | null) {
  if (!value) return '—';

  const normalized = value.trim();
  const match = normalized.match(/^(\d{2})(\d{4})$/);

  if (!match) return normalized;

  const [, fortnight, year] = match;
  return `${year} · Quincena ${Number(fortnight)}`;
}

export function formatVersionDisplayLabel(
  periodCode?: string | null,
  versionId?: number | null
) {
  if (periodCode) return periodCode;
  if (typeof versionId === 'number') return `#${versionId}`;
  return '—';
}

export function formatFileTypeLabel(value?: string | null) {
  if (!value) return '—';

  if (value.toUpperCase() === 'CATALOGO') {
    return 'Catálogo';
  }

  return value.toUpperCase();
}

export function formatNominaFileDisplayName(
  value?: string | null,
  fileType?: string | null
) {
  if (!value) return '—';

  const separatorIndex = value.indexOf('_');
  const normalizedName =
    separatorIndex > 0 ? value.slice(separatorIndex + 1) : value;

  const extensionIndex = normalizedName.lastIndexOf('.');
  const baseName =
    extensionIndex >= 0
      ? normalizedName.slice(0, extensionIndex)
      : normalizedName;
  const extension =
    extensionIndex >= 0 ? normalizedName.slice(extensionIndex) : '';

  const normalizedType = (fileType ?? '').toUpperCase();

  if (
    normalizedType &&
    baseName.toLowerCase().startsWith(normalizedType.toLowerCase())
  ) {
    const suffix = baseName.slice(normalizedType.length);
    const label = formatFileTypeLabel(normalizedType);
    return suffix ? `${label} ${suffix}${extension}` : `${label}${extension}`;
  }

  return normalizedName;
}
