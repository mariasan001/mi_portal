import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { NominaPeriodoEstadoDto } from '@/features/admin/nomina/monitoreo/model/monitoreo.types';
import { ApiError } from '@/lib/api/api.errors';

import { useMonitoreoResource } from './useMonitoreoResource';

vi.mock('@/features/admin/nomina/monitoreo/api/queries', () => ({
  obtenerEstadoPeriodo: vi.fn(),
}));

import { obtenerEstadoPeriodo } from '@/features/admin/nomina/monitoreo/api/queries';

const mockedObtenerEstadoPeriodo = vi.mocked(obtenerEstadoPeriodo);

const detalle: NominaPeriodoEstadoDto = {
  periodStateId: 1,
  payPeriodId: 8,
  periodCode: '082026',
  anio: 2026,
  quincena: 8,
  currentPreviaVersionId: 19,
  currentIntegradaVersionId: 0,
  previaLoaded: true,
  integradaLoaded: false,
  catalogLoaded: true,
  validated: false,
  released: false,
  releasedAt: null,
  releasedByUserId: null,
  hasCancellations: false,
  hasReexpeditions: false,
};

describe('useMonitoreoResource', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads period state successfully', async () => {
    mockedObtenerEstadoPeriodo.mockResolvedValueOnce(detalle);

    const { result } = renderHook(() => useMonitoreoResource());

    await act(async () => {
      await result.current.consultarEstadoPeriodo(8);
    });

    expect(mockedObtenerEstadoPeriodo).toHaveBeenCalledWith(8);
    expect(result.current.estadoPeriodo).toEqual(detalle);
    expect(result.current.loadingEstado).toBe(false);
    expect(result.current.errorEstado).toBeNull();
  });

  it('exposes an error when the request fails and can reset state', async () => {
    mockedObtenerEstadoPeriodo.mockRejectedValueOnce(
      new ApiError({ message: 'fallo', status: 500 })
    );

    const { result } = renderHook(() => useMonitoreoResource());

    await act(async () => {
      await expect(result.current.consultarEstadoPeriodo(8)).rejects.toBeInstanceOf(ApiError);
    });

    await waitFor(() => {
      expect(result.current.errorEstado).toBeTruthy();
    });

    act(() => {
      result.current.resetEstadoPeriodo();
    });

    expect(result.current.estadoPeriodo).toBeNull();
    expect(result.current.errorEstado).toBeNull();
    expect(result.current.loadingEstado).toBe(false);
  });
});
