import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { VersionNominaDto } from '@/features/admin/nomina/shared/model/versiones.types';

import { useVersionesExplorer } from './useVersionesExplorer';

const versiones: VersionNominaDto[] = [
  {
    versionId: 1,
    payPeriodId: 1,
    periodCode: '012026',
    anio: 2026,
    quincena: 1,
    stage: 'PREVIA',
    status: 'RELEASED',
    isCurrent: true,
    released: true,
    notes: '',
    loadedAt: '2026-03-10T12:00:00',
  },
  {
    versionId: 18,
    payPeriodId: 2,
    periodCode: '042026',
    anio: 2026,
    quincena: 4,
    stage: 'PREVIA',
    status: 'LOADED',
    isCurrent: true,
    released: false,
    notes: '',
    loadedAt: '2026-04-27T11:39:00',
  },
  {
    versionId: 30,
    payPeriodId: 9,
    periodCode: '092026',
    anio: 2026,
    quincena: 9,
    stage: 'INTEGRADA',
    status: 'PROCESSING',
    isCurrent: false,
    released: false,
    notes: '',
    loadedAt: '2026-05-01T08:30:00',
  },
];

describe('useVersionesExplorer', () => {
  it('exposes canonical stage and status options', () => {
    const { result } = renderHook(() => useVersionesExplorer(versiones));

    expect(result.current.stageOptions).toEqual(['Previa', 'Integrada']);
    expect(result.current.statusOptions).toEqual(['Liberada', 'Cargada', 'En proceso']);
    expect(result.current.filteredItems.map((item) => item.versionId)).toEqual([30, 18, 1]);
  });

  it('filters by stage and status using human labels', () => {
    const { result } = renderHook(() => useVersionesExplorer(versiones));

    act(() => {
      result.current.setStageFilter('Integrada');
    });

    expect(result.current.filteredItems.map((item) => item.versionId)).toEqual([30]);

    act(() => {
      result.current.setStageFilter('all');
      result.current.setStatusFilter('Liberada');
    });

    expect(result.current.filteredItems.map((item) => item.versionId)).toEqual([1]);
  });

  it('filters by query and supports ascending order', () => {
    const { result } = renderHook(() => useVersionesExplorer(versiones));

    act(() => {
      result.current.setQuery('092026');
    });

    expect(result.current.filteredItems.map((item) => item.versionId)).toEqual([30]);
    expect(result.current.metaText).toBe('1 de 3 registros');

    act(() => {
      result.current.setQuery('');
      result.current.setSort('asc');
    });

    expect(result.current.filteredItems.map((item) => item.versionId)).toEqual([1, 18, 30]);
  });
});
