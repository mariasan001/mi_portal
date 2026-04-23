import type {
  EmptyStateContent,
  PayrollErrorRowDto,
  PayrollPreviewRowDto,
  PayrollSummaryDto,
  ProcesamientoView,
  ResultHeader,
  SummaryField,
  SummaryKpi,
  SummaryTone,
} from './procesamiento.types';

export function getProcesamientoDefaultLimit(view: ProcesamientoView): string {
  return view === 'errors' ? '50' : '20';
}

export function getProcesamientoResultHeader(params: {
  activeView: ProcesamientoView;
  summary: PayrollSummaryDto | null;
  previewRows: PayrollPreviewRowDto[];
  errorRows: PayrollErrorRowDto[];
}): ResultHeader {
  const { activeView, summary, previewRows, errorRows } = params;

  if (activeView === 'summary') {
    return {
      eyebrow: 'Resultado',
      title: summary ? 'Resumen del procesamiento consultado' : 'Resumen del procesamiento',
      description: summary
        ? 'Aqui se muestran los indicadores principales y el estado general del archivo procesado.'
        : 'Consulta un fileId para visualizar metricas generales, estatus y conteos clave del procesamiento.',
    };
  }

  if (activeView === 'preview') {
    return {
      eyebrow: 'Resultado',
      title: previewRows.length ? 'Vista previa del archivo consultado' : 'Preview del archivo',
      description:
        'Revisa una muestra de filas procesadas para validar la informacion operativa del archivo.',
    };
  }

  return {
    eyebrow: 'Resultado',
    title: errorRows.length ? 'Detalle de errores consultados' : 'Filas con error',
    description:
      'Consulta filas con incidencias detectadas durante el procesamiento para revisar el motivo del error.',
  };
}

export function getProcesamientoEmptyState(activeView: ProcesamientoView): EmptyStateContent {
  if (activeView === 'summary') {
    return {
      title: 'Aun no has consultado ningun resumen',
      description: 'Captura un fileId valido para revisar las metricas generales del archivo procesado.',
    };
  }

  if (activeView === 'preview') {
    return {
      title: 'Aun no has cargado una vista previa',
      description: 'Consulta un fileId y un limite para visualizar una muestra de filas procesadas.',
    };
  }

  return {
    title: 'Aun no has consultado filas con error',
    description: 'Consulta un fileId y un limite para revisar las incidencias detectadas en el procesamiento.',
  };
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

export function getErrorTone(errorRows: number, processedRows: number): SummaryTone {
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
      label: 'Estatus de version',
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

export function formatCellValue(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  return String(value);
}
