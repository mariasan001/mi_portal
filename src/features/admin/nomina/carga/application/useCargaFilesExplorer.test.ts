import { describe, expect, it } from 'vitest';

import type { ArchivoNominaDto } from '@/features/admin/nomina/shared/model/catalogo.types';

import { useCargaFilesExplorer } from './useCargaFilesExplorer';
import { renderHook, act } from '@testing-library/react';

const baseItem = (overrides: Partial<ArchivoNominaDto>): ArchivoNominaDto => ({
  fileId: 1,
  versionId: 1,
  payPeriodId: 1,
  periodCode: '012026',
  stage: 'PREVIA',
  fileType: 'CATALOGO',
  fileName: 'catalogo012026.dbf',
  filePath: 'C:\\files\\catalogo012026.dbf',
  checksumSha256: 'abc',
  fileSizeBytes: 1024,
  rowCount: 100,
  status: 'UPLOADED',
  uploadedAt: '2026-04-28T12:00:00Z',
  ...overrides,
});

describe('useCargaFilesExplorer', () => {
  const items: ArchivoNominaDto[] = [
    baseItem({ fileId: 1, fileType: 'CATALOGO', status: 'PROCESSED' }),
    baseItem({
      fileId: 2,
      fileType: 'TCOMP',
      stage: 'PREVIA',
      status: 'UPLOADED',
      fileName: 'tcomp0426.dbf',
      periodCode: '042026',
    }),
    baseItem({
      fileId: 3,
      fileType: 'TCALC',
      stage: 'INTEGRADA',
      status: 'PROCESSING',
      fileName: 'tcalc0426.dbf',
      periodCode: '042026',
    }),
  ];

  it('filters by active entity', () => {
    const { result: catalogo } = renderHook(() =>
      useCargaFilesExplorer(items, 'catalogo')
    );
    const { result: nomina } = renderHook(() =>
      useCargaFilesExplorer(items, 'nomina')
    );

    expect(catalogo.current.filteredItems).toHaveLength(1);
    expect(catalogo.current.filteredItems[0].fileType).toBe('CATALOGO');

    expect(nomina.current.filteredItems).toHaveLength(2);
    expect(nomina.current.filteredItems.every((item) => item.fileType !== 'CATALOGO')).toBe(
      true
    );
  });

  it('exposes known stage options and filters by status and query', () => {
    const { result } = renderHook(() => useCargaFilesExplorer(items, 'nomina'));

    expect(result.current.stageOptions).toEqual(expect.arrayContaining(['Previa', 'Integrada']));

    act(() => {
      result.current.setStatusFilter('En proceso');
    });

    expect(result.current.filteredItems).toHaveLength(1);
    expect(result.current.filteredItems[0].fileType).toBe('TCALC');

    act(() => {
      result.current.setStatusFilter('all');
      result.current.setQuery('tcomp0426');
    });

    expect(result.current.filteredItems).toHaveLength(1);
    expect(result.current.filteredItems[0].fileType).toBe('TCOMP');
  });

  it('sorts file ids according to the selected order', () => {
    const { result } = renderHook(() => useCargaFilesExplorer(items, 'nomina'));

    expect(result.current.filteredItems.map((item) => item.fileId)).toEqual([3, 2]);

    act(() => {
      result.current.setSort('asc');
    });

    expect(result.current.filteredItems.map((item) => item.fileId)).toEqual([2, 3]);
  });
});
