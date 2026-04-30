import type { ArchivoNominaDto } from '@/features/admin/nomina/shared/model/catalogo.types';

import type {
  PayrollSummaryDto,
  SummaryKpi,
  SummaryTone,
} from './procesamiento.types';

export function getProcesamientoDefaultLimit(kind: 'preview' | 'errors'): string {
  return kind === 'errors' ? '50' : '20';
}

export function formatProcesamientoFileTypeLabel(value?: string | null) {
  if (!value) return 'Archivo';
  if (value.toUpperCase() === 'CATALOGO') return 'Catalogo';
  return value.toUpperCase();
}

export function formatProcesamientoStageLabel(value?: string | null) {
  if (!value) return 'Sin etapa';

  return value
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function formatProcesamientoStatusLabel(value?: string | null) {
  const normalized = (value ?? '').toUpperCase();

  switch (normalized) {
    case 'PROCESSED':
      return 'Procesado';
    case 'LOADED':
    case 'UPLOADED':
      return 'Cargado';
    case 'PROCESSING':
      return 'En proceso';
    case 'COMPLETED':
      return 'Completado';
    case 'SUCCESS':
      return 'Exitoso';
    case 'VALIDATED':
      return 'Validado';
    case 'FAILED':
    case 'ERROR':
      return 'Error';
    case 'RELEASED':
      return 'Liberada';
    case 'PENDING':
      return 'Pendiente';
    default:
      return formatProcesamientoStageLabel(value);
  }
}

export function getProcesamientoFileNameFilter(file: ArchivoNominaDto): string {
  return formatProcesamientoFileTypeLabel(file.fileType);
}

export function matchesProcesamientoFilters(params: {
  file: ArchivoNominaDto;
  periodFilter: string;
  nameFilter: string;
}) {
  const { file, periodFilter, nameFilter } = params;
  const matchesPeriod =
    periodFilter === 'all' || file.periodCode === periodFilter;

  if (!matchesPeriod) {
    return false;
  }

  return (
    nameFilter === 'all' ||
    getProcesamientoFileNameFilter(file) === nameFilter
  );
}

export function getProcesamientoPeriodOptions(files: ArchivoNominaDto[]) {
  return Array.from(new Set(files.map((file) => file.periodCode).filter(Boolean))).sort(
    (left, right) => right.localeCompare(left)
  );
}

export function getProcesamientoNameOptions(
  files: ArchivoNominaDto[],
  periodFilter: string
) {
  return Array.from(
    new Set(
      files
        .filter((file) =>
          matchesProcesamientoFilters({
            file,
            periodFilter,
            nameFilter: 'all',
          })
        )
        .map(getProcesamientoFileNameFilter)
    )
  ).sort((left, right) => left.localeCompare(right));
}

export function findProcesamientoFileByFilters(params: {
  files: ArchivoNominaDto[];
  periodFilter: string;
  nameFilter: string;
}) {
  const { files, periodFilter, nameFilter } = params;

  return (
    files.find((file) =>
      matchesProcesamientoFilters({
        file,
        periodFilter,
        nameFilter,
      })
    ) ?? null
  );
}

export function getStatusTone(value: string): SummaryTone {
  const normalized = value.trim().toLowerCase();

  if (
    normalized.includes('ok') ||
    normalized.includes('success') ||
    normalized.includes('complet') ||
    normalized.includes('proces')
  ) {
    return 'ok';
  }

  if (
    normalized.includes('pend') ||
    normalized.includes('progress') ||
    normalized.includes('partial') ||
    normalized.includes('valid')
  ) {
    return 'warn';
  }

  if (
    normalized.includes('error') ||
    normalized.includes('fail') ||
    normalized.includes('rechaz')
  ) {
    return 'danger';
  }

  return 'neutral';
}

export function getPreviewStatusTone(value: string): SummaryTone {
  const normalized = value.trim().toLowerCase();

  if (
    normalized.includes('ok') ||
    normalized.includes('success') ||
    normalized.includes('loaded') ||
    normalized.includes('process') ||
    normalized.includes('complete')
  ) {
    return 'ok';
  }

  if (
    normalized.includes('pending') ||
    normalized.includes('progress') ||
    normalized.includes('partial') ||
    normalized.includes('valid')
  ) {
    return 'warn';
  }

  if (
    normalized.includes('error') ||
    normalized.includes('fail') ||
    normalized.includes('reject')
  ) {
    return 'danger';
  }

  return 'neutral';
}

export function getErrorTone(
  errorRows: number,
  processedRows: number
): SummaryTone {
  if (errorRows === 0) return 'ok';
  if (processedRows > 0) return 'warn';
  return 'danger';
}

export function getSummaryKpis(detalle: PayrollSummaryDto): SummaryKpi[] {
  const errorTone = getErrorTone(detalle.errorRows, detalle.processedRows);

  return [
    {
      key: 'totalRowsInFile',
      label: 'Total de filas',
      value: detalle.totalRowsInFile,
    },
    {
      key: 'processedRows',
      label: 'Procesadas',
      value: detalle.processedRows,
    },
    {
      key: 'errorRows',
      label: 'Con error',
      value: detalle.errorRows,
      tone: errorTone,
    },
  ];
}

export function formatCellValue(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  return String(value);
}
