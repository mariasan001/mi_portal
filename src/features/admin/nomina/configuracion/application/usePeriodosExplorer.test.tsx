import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { PeriodoNominaDto } from '@/features/admin/nomina/shared/model/periodos.types';

import { usePeriodosExplorer } from './usePeriodosExplorer';

const periodos: PeriodoNominaDto[] = [
  {
    periodId: 1,
    anio: 2025,
    quincena: 1,
    periodoCode: 'P-1',
    fechaInicio: '2025-01-01',
    fechaFin: '2025-01-15',
    fechaPagoEstimada: '2025-01-16',
  },
  {
    periodId: 3,
    anio: 2026,
    quincena: 2,
    periodoCode: 'P-2',
    fechaInicio: '2026-01-16',
    fechaFin: '2026-01-31',
    fechaPagoEstimada: '2026-02-01',
  },
  {
    periodId: 2,
    anio: 2026,
    quincena: 4,
    periodoCode: 'P-4',
    fechaInicio: '2026-02-01',
    fechaFin: '2026-02-15',
    fechaPagoEstimada: '2026-02-16',
  },
];

describe('usePeriodosExplorer', () => {
  it('starts sorted by descending id and exposes quincena options', () => {
    const { result } = renderHook(() => usePeriodosExplorer(periodos));

    expect(result.current.filteredItems.map((item) => item.periodId)).toEqual([3, 2, 1]);
    expect(result.current.quincenaOptions).toEqual([1, 2, 4]);
    expect(result.current.metaText).toBe('3 registros');
  });

  it('filters by query and quincena', () => {
    const { result } = renderHook(() => usePeriodosExplorer(periodos));

    act(() => {
      result.current.setQuery('2026 / Q4');
    });

    expect(result.current.filteredItems.map((item) => item.periodId)).toEqual([2]);
    expect(result.current.metaText).toBe('1 de 3 registros');

    act(() => {
      result.current.setQuery('');
      result.current.setQuincenaFilter('2');
    });

    expect(result.current.filteredItems.map((item) => item.periodId)).toEqual([3]);
    expect(result.current.metaText).toBe('1 de 3 registros');
  });

  it('supports ascending order', () => {
    const { result } = renderHook(() => usePeriodosExplorer(periodos));

    act(() => {
      result.current.setSort('asc');
    });

    expect(result.current.filteredItems.map((item) => item.periodId)).toEqual([1, 2, 3]);
  });
});
