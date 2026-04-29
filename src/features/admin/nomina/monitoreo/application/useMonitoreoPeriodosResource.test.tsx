import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { PeriodoNominaDto } from '@/features/admin/nomina/shared/model/periodos.types';
import { ApiError } from '@/lib/api/api.errors';

import { useMonitoreoPeriodosResource } from './useMonitoreoPeriodosResource';

vi.mock('@/features/admin/nomina/configuracion/api/periodos', () => ({
  listarPeriodosNomina: vi.fn(),
}));

import { listarPeriodosNomina } from '@/features/admin/nomina/configuracion/api/periodos';

const mockedListarPeriodosNomina = vi.mocked(listarPeriodosNomina);

const periodos: PeriodoNominaDto[] = [
  {
    periodId: 8,
    anio: 2026,
    quincena: 8,
    periodoCode: '082026',
    fechaInicio: '2026-04-16',
    fechaFin: '2026-04-30',
    fechaPagoEstimada: '2026-04-30',
  },
];

describe('useMonitoreoPeriodosResource', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads periods on mount', async () => {
    mockedListarPeriodosNomina.mockResolvedValueOnce(periodos);

    const { result } = renderHook(() => useMonitoreoPeriodosResource());

    await waitFor(() => {
      expect(result.current.lista).toEqual(periodos);
    });

    expect(result.current.loadingLista).toBe(false);
    expect(result.current.errorLista).toBeNull();
  });

  it('keeps previous data and exposes an error when reload fails', async () => {
    mockedListarPeriodosNomina.mockResolvedValueOnce(periodos);

    const { result } = renderHook(() => useMonitoreoPeriodosResource());

    await waitFor(() => {
      expect(result.current.lista).toEqual(periodos);
    });

    mockedListarPeriodosNomina.mockRejectedValueOnce(
      new ApiError({ message: 'fallo', status: 500 })
    );

    await act(async () => {
      await expect(result.current.cargarLista()).rejects.toBeInstanceOf(ApiError);
    });

    await waitFor(() => {
      expect(result.current.errorLista).toBeTruthy();
    });

    expect(result.current.lista).toEqual(periodos);
    expect(result.current.loadingLista).toBe(false);
  });
});
