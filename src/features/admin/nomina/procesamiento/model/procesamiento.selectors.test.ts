import { describe, expect, it } from 'vitest';

import type { ArchivoNominaDto } from '@/features/admin/nomina/shared/model/catalogo.types';

import type { PayrollSummaryDto } from './procesamiento.types';
import {
  findProcesamientoFileByFilters,
  formatCellValue,
  formatProcesamientoFileTypeLabel,
  formatProcesamientoStageLabel,
  formatProcesamientoStatusLabel,
  getProcesamientoDefaultLimit,
  getProcesamientoNameOptions,
  getProcesamientoPeriodOptions,
  getStatusTone,
  getSummaryKpis,
  matchesProcesamientoFilters,
} from './procesamiento.selectors';

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
  {
    fileId: 8,
    versionId: 18,
    payPeriodId: 6,
    periodCode: '062026',
    stage: 'INTEGRADA',
    fileType: 'CATALOGO',
    fileName: 'catalogo062026.dbf',
    filePath: 'C:\\files\\catalogo062026.dbf',
    checksumSha256: 'ghi',
    fileSizeBytes: 80,
    rowCount: 10,
    status: 'ERROR',
    uploadedAt: '2026-04-10T11:00:00Z',
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
  processedRows: 97,
  errorRows: 3,
};

describe('procesamiento.selectors', () => {
  it('formats file type, stage, status, and nullable cell values', () => {
    expect(formatProcesamientoFileTypeLabel('CATALOGO')).toBe('Catalogo');
    expect(formatProcesamientoStageLabel('pre_validacion')).toBe('Pre Validacion');
    expect(formatProcesamientoStatusLabel('PROCESSING')).toBe('En proceso');
    expect(formatCellValue(null)).toBe('-');
    expect(formatCellValue('valor')).toBe('valor');
  });

  it('builds filter options and resolves files from period and name', () => {
    expect(getProcesamientoDefaultLimit('preview')).toBe('20');
    expect(getProcesamientoDefaultLimit('errors')).toBe('50');
    expect(getProcesamientoPeriodOptions(files)).toEqual(['072026', '062026']);
    expect(getProcesamientoNameOptions(files, '072026')).toEqual(['TCALC', 'TCOMP']);

    expect(
      matchesProcesamientoFilters({
        file: files[0],
        periodFilter: '072026',
        nameFilter: 'TCALC',
      })
    ).toBe(true);

    expect(
      findProcesamientoFileByFilters({
        files,
        periodFilter: '072026',
        nameFilter: 'TCOMP',
      })
    ).toMatchObject({ fileId: 11 });
  });

  it('maps summary tones and kpis consistently', () => {
    expect(getStatusTone('PROCESSED')).toBe('ok');
    expect(getStatusTone('VALIDATED')).toBe('warn');
    expect(getStatusTone('ERROR')).toBe('danger');

    expect(getSummaryKpis(summary)).toEqual([
      { key: 'totalRowsInFile', label: 'Total de filas', value: 100 },
      { key: 'processedRows', label: 'Procesadas', value: 97 },
      { key: 'errorRows', label: 'Con error', value: 3, tone: 'warn' },
    ]);
  });
});
