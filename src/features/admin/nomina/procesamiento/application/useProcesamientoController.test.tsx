import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ArchivoNominaDto } from '@/features/admin/nomina/shared/model/catalogo.types';
import type {
  PayrollErrorRowDto,
  PayrollPreviewRowDto,
  PayrollSummaryDto,
} from '../model/procesamiento.types';
import { useProcesamientoController } from './useProcesamientoController';

const toastSuccess = vi.fn();
const toastWarning = vi.fn();
const toastError = vi.fn();

vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccess(...args),
    warning: (...args: unknown[]) => toastWarning(...args),
    error: (...args: unknown[]) => toastError(...args),
  },
}));

vi.mock('@/features/admin/nomina/carga/application/useNominaFilesResource', () => ({
  useNominaFilesResource: vi.fn(),
}));

vi.mock('./useProcesamientoResource', () => ({
  useProcesamientoResource: vi.fn(),
}));

import { useNominaFilesResource } from '@/features/admin/nomina/carga/application/useNominaFilesResource';
import { useProcesamientoResource } from './useProcesamientoResource';

const mockedUseNominaFilesResource = vi.mocked(useNominaFilesResource);
const mockedUseProcesamientoResource = vi.mocked(useProcesamientoResource);

const files: ArchivoNominaDto[] = [
  {
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
  },
  {
    fileId: 11,
    versionId: 20,
    payPeriodId: 7,
    periodCode: '072026',
    stage: 'PREVIA',
    fileType: 'TCOMP',
    fileName: 'tcomp072026.dbf',
    filePath: 'C:\\files\\tcomp072026.dbf',
    checksumSha256: 'def',
    fileSizeBytes: 140,
    rowCount: 30,
    status: 'LOADED',
    uploadedAt: '2026-04-28T11:00:00Z',
  },
];

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
  processedRows: 98,
  errorRows: 2,
};

const previewRows: PayrollPreviewRowDto[] = [];
const errorRows: PayrollErrorRowDto[] = [];

describe('useProcesamientoController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exposes period and name options from available files', () => {
    mockedUseNominaFilesResource.mockReturnValue({
      lista: files,
      loadingLista: false,
      errorLista: null,
      cargarLista: vi.fn(),
    });

    mockedUseProcesamientoResource.mockReturnValue({
      summary: null,
      previewRows,
      errorRows,
      loadingSummary: false,
      loadingPreview: false,
      loadingErrors: false,
      errorSummary: null,
      errorPreview: null,
      errorErrors: null,
      consultarSummary: vi.fn(),
      consultarPreview: vi.fn(),
      consultarErrors: vi.fn(),
      resetSummary: vi.fn(),
      resetPreview: vi.fn(),
      resetErrors: vi.fn(),
      resetAll: vi.fn(),
    });

    const { result } = renderHook(() => useProcesamientoController());

    expect(result.current.periodOptions).toEqual(['072026']);
    expect(result.current.nameOptions).toEqual(['TCALC', 'TCOMP']);
    expect(result.current.currentError).toBeNull();
  });

  it('auto-consults the matched file when period and name are selected', async () => {
    const consultarSummary = vi.fn().mockResolvedValue(summary);
    const consultarPreview = vi.fn().mockResolvedValue(previewRows);
    const consultarErrors = vi.fn().mockResolvedValue(errorRows);
    const resetAll = vi.fn();

    mockedUseNominaFilesResource.mockReturnValue({
      lista: files,
      loadingLista: false,
      errorLista: null,
      cargarLista: vi.fn(),
    });

    mockedUseProcesamientoResource.mockReturnValue({
      summary,
      previewRows,
      errorRows,
      loadingSummary: false,
      loadingPreview: false,
      loadingErrors: false,
      errorSummary: null,
      errorPreview: null,
      errorErrors: null,
      consultarSummary,
      consultarPreview,
      consultarErrors,
      resetSummary: vi.fn(),
      resetPreview: vi.fn(),
      resetErrors: vi.fn(),
      resetAll,
    });

    const { result } = renderHook(() => useProcesamientoController());

    await act(async () => {
      result.current.setPeriodFilter('072026');
    });

    await act(async () => {
      await result.current.setNameFilter('TCALC');
    });

    await waitFor(() => {
      expect(result.current.selectedFileId).toBe('12');
    });

    expect(consultarSummary).toHaveBeenCalledWith(12);
    expect(consultarPreview).toHaveBeenCalledWith(12, 20);
    expect(consultarErrors).toHaveBeenCalledWith(12, 50);
    expect(toastSuccess).toHaveBeenCalled();
    expect(resetAll).toHaveBeenCalled();
  });

  it('shows partial feedback when one of the consultas fails', async () => {
    const consultarSummary = vi.fn().mockResolvedValue(summary);
    const consultarPreview = vi.fn().mockRejectedValue(new Error('fallo preview'));
    const consultarErrors = vi.fn().mockResolvedValue(errorRows);

    mockedUseNominaFilesResource.mockReturnValue({
      lista: files,
      loadingLista: false,
      errorLista: null,
      cargarLista: vi.fn(),
    });

    mockedUseProcesamientoResource.mockReturnValue({
      summary: null,
      previewRows,
      errorRows,
      loadingSummary: false,
      loadingPreview: false,
      loadingErrors: false,
      errorSummary: null,
      errorPreview: 'fallo preview',
      errorErrors: null,
      consultarSummary,
      consultarPreview,
      consultarErrors,
      resetSummary: vi.fn(),
      resetPreview: vi.fn(),
      resetErrors: vi.fn(),
      resetAll: vi.fn(),
    });

    const { result } = renderHook(() => useProcesamientoController());

    await act(async () => {
      result.current.setPeriodFilter('072026');
    });

    await act(async () => {
      await result.current.setNameFilter('TCALC');
    });

    expect(toastWarning).toHaveBeenCalled();
    expect(toastError).not.toHaveBeenCalled();
  });
});
