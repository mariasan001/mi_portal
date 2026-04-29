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

const NOMINA_FILE_TYPE_PATTERNS: Array<[string, string]> = [
  ['HNCOMGRA', 'HNCOMGRA'],
  ['HNCOMADI', 'HNCOMADI'],
  ['CONTAGUB', 'CONTAGUB'],
  ['TCOMP', 'TCOMP'],
  ['TCALC', 'TCALC'],
  ['COMP', 'COMP'],
  ['CALC', 'CALC'],
  ['CATALOGO', 'CATALOGO'],
];

export function inferNominaFileTypeFromName(fileName?: string | null) {
  if (!fileName) return null;

  const normalized = fileName.trim().toUpperCase();

  for (const [pattern, fileType] of NOMINA_FILE_TYPE_PATTERNS) {
    if (normalized.startsWith(pattern) || normalized.includes(`_${pattern}`)) {
      return fileType;
    }
  }

  return null;
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
