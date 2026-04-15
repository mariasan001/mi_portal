import { PayrollErrorRowDto, PayrollPreviewRowDto, PayrollSummaryDto } from "@/features/admin/types/nomina-procesamiento.types";

type ProcesamientoView = 'summary' | 'preview' | 'errors';

type ResultHeader = {
  eyebrow: string;
  title: string;
  description: string;
};

type EmptyStateContent = {
  title: string;
  description: string;
};

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
      title: summary
        ? 'Resumen del procesamiento consultado'
        : 'Resumen del procesamiento',
      description: summary
        ? 'Aquí se muestran los indicadores principales y el estado general del archivo procesado.'
        : 'Consulta un fileId para visualizar métricas generales, estatus y conteos clave del procesamiento.',
    };
  }

  if (activeView === 'preview') {
    return {
      eyebrow: 'Resultado',
      title: previewRows.length
        ? 'Vista previa del archivo consultado'
        : 'Preview del archivo',
      description:
        'Revisa una muestra de filas procesadas para validar la información operativa del archivo.',
    };
  }

  return {
    eyebrow: 'Resultado',
    title: errorRows.length
      ? 'Detalle de errores consultados'
      : 'Filas con error',
    description:
      'Consulta filas con incidencias detectadas durante el procesamiento para revisar el motivo del error.',
  };
}

export function getProcesamientoEmptyState(
  activeView: ProcesamientoView
): EmptyStateContent {
  if (activeView === 'summary') {
    return {
      title: 'Aún no has consultado ningún resumen',
      description:
        'Captura un fileId válido para revisar las métricas generales del archivo procesado.',
    };
  }

  if (activeView === 'preview') {
    return {
      title: 'Aún no has cargado una vista previa',
      description:
        'Consulta un fileId y un límite para visualizar una muestra de filas procesadas.',
    };
  }

  return {
    title: 'Aún no has consultado filas con error',
    description:
      'Consulta un fileId y un límite para revisar las incidencias detectadas en el procesamiento.',
  };
}