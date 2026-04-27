export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '-';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function formatUnknown(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

export function normalizeSignatureStatus(status?: string | null): string {
  return status?.trim().toUpperCase() ?? '';
}

export function getSignatureStatusLabel(status?: string | null): string {
  switch (normalizeSignatureStatus(status)) {
    case 'PENDING':
      return 'Pendiente';
    case 'PROCESSING':
      return 'Procesando';
    case 'SIGNED':
      return 'Firmado';
    case 'FAILED':
      return 'Fallido';
    default:
      return 'Sin estatus';
  }
}
