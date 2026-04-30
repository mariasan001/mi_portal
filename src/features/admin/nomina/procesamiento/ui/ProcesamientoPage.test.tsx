import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { ArchivoNominaDto } from '@/features/admin/nomina/shared/model/catalogo.types';
import type { PayrollSummaryDto } from '../model/procesamiento.types';
import ProcesamientoPage from './ProcesamientoPage';

vi.mock('../application/useProcesamientoController', () => ({
  useProcesamientoController: vi.fn(),
}));

vi.mock('./components/NominaProcesamientoToolbar', () => ({
  default: () => <div>toolbar</div>,
}));

vi.mock('./components/NominaProcesamientoSummaryPanel', () => ({
  default: ({ detalle }: { detalle: PayrollSummaryDto }) => (
    <div>summary:{detalle.fileName}</div>
  ),
}));

vi.mock('./components/NominaProcesamientoPreviewTable', () => ({
  default: ({ rows }: { rows: unknown[] }) => <div>preview:{rows.length}</div>,
}));

vi.mock('./components/NominaProcesamientoErrorsTable', () => ({
  default: ({ rows }: { rows: unknown[] }) => <div>errors:{rows.length}</div>,
}));

import { useProcesamientoController } from '../application/useProcesamientoController';

const mockedUseProcesamientoController = vi.mocked(useProcesamientoController);

const selectedFile: ArchivoNominaDto = {
  fileId: 12,
  versionId: 20,
  payPeriodId: 7,
  periodCode: '072026',
  stage: 'PREVIA',
  fileType: 'TCALC',
  fileName: 'tcalc072026.dbf',
  filePath: 'C:\\files\\tcalc072026.dbf',
  checksumSha256: 'abc',
  fileSizeBytes: 120,
  rowCount: 20,
  status: 'PROCESSED',
  uploadedAt: '2026-04-28T12:00:00Z',
};

const summary: PayrollSummaryDto = {
  fileId: 12,
  fileType: 'TCALC',
  fileStatus: 'PROCESSED',
  fileName: 'tcalc072026.dbf',
  filePath: 'C:\\files\\tcalc072026.dbf',
  versionId: 20,
  stage: 'PREVIA',
  versionStatus: 'LOADED',
  payPeriodId: 7,
  periodCode: '072026',
  totalRowsInFile: 100,
  processedRows: 99,
  errorRows: 1,
};

function buildVm(overrides: Partial<ReturnType<typeof useProcesamientoController>> = {}) {
  return {
    selectedFileId: '',
    selectedFile: null,
    periodFilter: 'all',
    periodOptions: ['072026'],
    nameFilter: 'all',
    nameOptions: ['TCALC'],
    setPeriodFilter: vi.fn(),
    setNameFilter: vi.fn(),
    loading: false,
    currentError: null,
    hasConsultedSummary: false,
    hasConsultedPreview: false,
    hasConsultedErrors: false,
    summary: null,
    previewRows: [],
    errorRows: [],
    ...overrides,
  };
}

describe('ProcesamientoPage', () => {
  it('shows a single shared empty state before any consulta', () => {
    mockedUseProcesamientoController.mockReturnValue(buildVm());

    render(<ProcesamientoPage />);

    expect(screen.getByText('Aun no has consultado ningun archivo')).toBeInTheDocument();
    expect(screen.queryByText('Vista previa')).not.toBeInTheDocument();
    expect(screen.queryByText('Errores')).not.toBeInTheDocument();
  });

  it('renders summary, preview, and conditional errors inside the unified result shell', () => {
    mockedUseProcesamientoController.mockReturnValue(
      buildVm({
        selectedFileId: '12',
        selectedFile,
        hasConsultedSummary: true,
        hasConsultedPreview: true,
        hasConsultedErrors: true,
        summary,
        previewRows: [{ rowNum: 1 }, { rowNum: 2 }] as never[],
        errorRows: [{ rowNum: 8 }] as never[],
      })
    );

    render(<ProcesamientoPage />);

    expect(screen.getByText('summary:tcalc072026.dbf')).toBeInTheDocument();
    expect(screen.getByText('Vista previa')).toBeInTheDocument();
    expect(screen.getByText('preview:2')).toBeInTheDocument();
    expect(screen.getByText('Errores')).toBeInTheDocument();
    expect(screen.getByText('errors:1')).toBeInTheDocument();
  });

  it('hides the errors accordion when there are no error rows', () => {
    mockedUseProcesamientoController.mockReturnValue(
      buildVm({
        selectedFileId: '12',
        selectedFile,
        hasConsultedSummary: true,
        hasConsultedPreview: true,
        hasConsultedErrors: true,
        summary,
        previewRows: [{ rowNum: 1 }] as never[],
        errorRows: [],
      })
    );

    render(<ProcesamientoPage />);

    expect(screen.getByText('Vista previa')).toBeInTheDocument();
    expect(screen.queryByText('Errores')).not.toBeInTheDocument();
  });
});
