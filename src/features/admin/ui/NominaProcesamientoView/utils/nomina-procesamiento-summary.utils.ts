import type { PayrollSummaryDto } from '@/features/admin/types/nomina-procesamiento.types';

export type SummaryTone = 'ok' | 'warn' | 'danger' | 'neutral';

export type SummaryKpi = {
  key: string;
  label: string;
  value: number | string;
  tone?: SummaryTone;
};

export type SummaryField = {
  key: string;
  label: string;
  value: number | string;
  wide?: boolean;
  icon:
    | 'hash'
    | 'file'
    | 'status'
    | 'folder'
    | 'layers'
    | 'warning';
  tone?: SummaryTone;
  asBadge?: boolean;
};

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
      label: 'Total filas',
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

export function getSummaryFields(detalle: PayrollSummaryDto): SummaryField[] {
  const fileStatusTone = getStatusTone(detalle.fileStatus);
  const versionStatusTone = getStatusTone(detalle.versionStatus);

  return [
    {
      key: 'fileId',
      label: 'fileId',
      value: detalle.fileId,
      icon: 'hash',
    },
    {
      key: 'fileType',
      label: 'Tipo de archivo',
      value: detalle.fileType,
      icon: 'file',
    },
    {
      key: 'fileStatus',
      label: 'Estatus del archivo',
      value: detalle.fileStatus,
      icon: 'status',
      tone: fileStatusTone,
      asBadge: true,
    },
    {
      key: 'fileName',
      label: 'Nombre del archivo',
      value: detalle.fileName,
      icon: 'folder',
      wide: true,
    },
    {
      key: 'filePath',
      label: 'Ruta del archivo',
      value: detalle.filePath,
      icon: 'folder',
      wide: true,
    },
    {
      key: 'versionId',
      label: 'versionId',
      value: detalle.versionId,
      icon: 'layers',
    },
    {
      key: 'stage',
      label: 'Etapa',
      value: detalle.stage,
      icon: 'layers',
    },
    {
      key: 'versionStatus',
      label: 'Estatus de versión',
      value: detalle.versionStatus,
      icon: 'warning',
      tone: versionStatusTone,
      asBadge: true,
    },
    {
      key: 'payPeriodId',
      label: 'payPeriodId',
      value: detalle.payPeriodId,
      icon: 'hash',
    },
    {
      key: 'periodCode',
      label: 'periodCode',
      value: detalle.periodCode,
      icon: 'hash',
    },
  ];
}