import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/lib/api/api.errors';

import type {
  PayrollErrorRowDto,
  PayrollPreviewRowDto,
  PayrollSummaryDto,
} from '../model/procesamiento.types';
import { useProcesamientoResource } from './useProcesamientoResource';

vi.mock('../api/queries', () => ({
  obtenerPayrollSummary: vi.fn(),
  obtenerPayrollPreview: vi.fn(),
  obtenerPayrollErrors: vi.fn(),
}));

import {
  obtenerPayrollErrors,
  obtenerPayrollPreview,
  obtenerPayrollSummary,
} from '../api/queries';

const mockedObtenerPayrollSummary = vi.mocked(obtenerPayrollSummary);
const mockedObtenerPayrollPreview = vi.mocked(obtenerPayrollPreview);
const mockedObtenerPayrollErrors = vi.mocked(obtenerPayrollErrors);

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
  processedRows: 100,
  errorRows: 0,
};

const previewRows: PayrollPreviewRowDto[] = [
  {
    fileId: 12,
    rowNum: 1,
    fileType: 'TCALC',
    payPeriodCode: '072026',
    receiptPeriodCode: '072026',
    neyemp: '001',
    neyrfc: 'XAXX010101000',
    negnom: 'NOMBRE',
    necpza: 'PZA',
    necads: 'ADS',
    neccat: 'CAT',
    negppa: 'GPPA',
    necche: 'CHE',
    necrec: 'REC',
    necsex: 'M',
    netipi: 'BASE',
    nefocuRaw: 'RAW',
    fechaOcupacionInicio: '2026-04-01',
    fechaOcupacionFin: '2026-04-15',
    ocupacionIndefinida: false,
    nominaTipo: 1,
    isReexpedition: false,
    neitpe: 1,
    neitde: 1,
    neipne: 1,
    loadStatus: 'PROCESSED',
  },
];

const errorRows: PayrollErrorRowDto[] = [
  {
    fileId: 12,
    rowNum: 2,
    fileType: 'TCALC',
    payPeriodCode: '072026',
    receiptPeriodCode: '072026',
    neyemp: '001',
    necpza: 'PZA',
    nominaTipo: 1,
    isReexpedition: false,
    errorDetail: 'RFC invalido',
  },
];

describe('useProcesamientoResource', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads summary, preview, and errors successfully', async () => {
    mockedObtenerPayrollSummary.mockResolvedValueOnce(summary);
    mockedObtenerPayrollPreview.mockResolvedValueOnce(previewRows);
    mockedObtenerPayrollErrors.mockResolvedValueOnce(errorRows);

    const { result } = renderHook(() => useProcesamientoResource());

    await act(async () => {
      await result.current.consultarSummary(12);
      await result.current.consultarPreview(12, 20);
      await result.current.consultarErrors(12, 50);
    });

    expect(mockedObtenerPayrollSummary).toHaveBeenCalledWith(12);
    expect(mockedObtenerPayrollPreview).toHaveBeenCalledWith(12, 20);
    expect(mockedObtenerPayrollErrors).toHaveBeenCalledWith(12, 50);
    expect(result.current.summary).toEqual(summary);
    expect(result.current.previewRows).toEqual(previewRows);
    expect(result.current.errorRows).toEqual(errorRows);
    expect(result.current.errorSummary).toBeNull();
    expect(result.current.errorPreview).toBeNull();
    expect(result.current.errorErrors).toBeNull();
  });

  it('exposes request errors and resets all state', async () => {
    mockedObtenerPayrollSummary.mockResolvedValueOnce(summary);
    mockedObtenerPayrollPreview.mockRejectedValueOnce(
      new ApiError({ message: 'fallo preview', status: 500 })
    );

    const { result } = renderHook(() => useProcesamientoResource());

    await act(async () => {
      await result.current.consultarSummary(12);
      await expect(result.current.consultarPreview(12, 20)).rejects.toBeInstanceOf(ApiError);
    });

    await waitFor(() => {
      expect(result.current.errorPreview).toBeTruthy();
    });

    act(() => {
      result.current.resetAll();
    });

    expect(result.current.summary).toBeNull();
    expect(result.current.previewRows).toEqual([]);
    expect(result.current.errorRows).toEqual([]);
    expect(result.current.errorSummary).toBeNull();
    expect(result.current.errorPreview).toBeNull();
    expect(result.current.errorErrors).toBeNull();
  });
});
