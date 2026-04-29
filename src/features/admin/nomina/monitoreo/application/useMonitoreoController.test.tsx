import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { NominaPeriodoEstadoDto } from '@/features/admin/nomina/monitoreo/model/monitoreo.types';
import type { PeriodoNominaDto } from '@/features/admin/nomina/shared/model/periodos.types';

import { useMonitoreoController } from './useMonitoreoController';

const toastSuccess = vi.fn();
const toastError = vi.fn();

vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccess(...args),
    error: (...args: unknown[]) => toastError(...args),
  },
}));

vi.mock('./useMonitoreoPeriodosResource', () => ({
  useMonitoreoPeriodosResource: vi.fn(),
}));

vi.mock('./useMonitoreoResource', () => ({
  useMonitoreoResource: vi.fn(),
}));

import { useMonitoreoPeriodosResource } from './useMonitoreoPeriodosResource';
import { useMonitoreoResource } from './useMonitoreoResource';

const mockedUseMonitoreoPeriodosResource = vi.mocked(useMonitoreoPeriodosResource);
const mockedUseMonitoreoResource = vi.mocked(useMonitoreoResource);

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

describe('useMonitoreoController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps periods to options and exposes default helper text', () => {
    mockedUseMonitoreoPeriodosResource.mockReturnValue({
      lista: periodos,
      loadingLista: false,
      errorLista: null,
      cargarLista: vi.fn(),
    });

    mockedUseMonitoreoResource.mockReturnValue({
      estadoPeriodo: undefined,
      loadingEstado: false,
      errorEstado: null,
      consultarEstadoPeriodo: vi.fn(),
      resetEstadoPeriodo: vi.fn(),
    });

    const { result } = renderHook(() => useMonitoreoController());

    expect(result.current.options).toEqual([
      {
        label: '2026 · Quincena 8 · 082026',
        value: '8',
      },
    ]);
    expect(result.current.helperText).toBe('Selecciona un periodo existente.');
    expect(result.current.activeError).toBeNull();
  });

  it('consults the selected period and shows success feedback', async () => {
    const consultarEstadoPeriodo = vi.fn().mockResolvedValue(detalle);
    const resetEstadoPeriodo = vi.fn();

    mockedUseMonitoreoPeriodosResource.mockReturnValue({
      lista: periodos,
      loadingLista: false,
      errorLista: null,
      cargarLista: vi.fn(),
    });

    mockedUseMonitoreoResource.mockReturnValue({
      estadoPeriodo: detalle,
      loadingEstado: false,
      errorEstado: null,
      consultarEstadoPeriodo,
      resetEstadoPeriodo,
    });

    const { result } = renderHook(() => useMonitoreoController());

    await act(async () => {
      await result.current.handleSelectPeriod('8');
    });

    expect(consultarEstadoPeriodo).toHaveBeenCalledWith(8);
    expect(resetEstadoPeriodo).not.toHaveBeenCalled();
    expect(toastSuccess).toHaveBeenCalled();

    await waitFor(() => {
      expect(result.current.selectedPeriodId).toBe('8');
    });
  });

  it('resets state on invalid selection and shows an error when consultation fails', async () => {
    const consultarEstadoPeriodo = vi.fn().mockRejectedValue(new Error('fallo'));
    const resetEstadoPeriodo = vi.fn();

    mockedUseMonitoreoPeriodosResource.mockReturnValue({
      lista: periodos,
      loadingLista: false,
      errorLista: 'No se pudo cargar periodos.',
      cargarLista: vi.fn(),
    });

    mockedUseMonitoreoResource.mockReturnValue({
      estadoPeriodo: undefined,
      loadingEstado: false,
      errorEstado: 'No se pudo consultar.',
      consultarEstadoPeriodo,
      resetEstadoPeriodo,
    });

    const { result } = renderHook(() => useMonitoreoController());

    await act(async () => {
      await result.current.handleSelectPeriod('');
    });

    expect(resetEstadoPeriodo).toHaveBeenCalled();
    expect(consultarEstadoPeriodo).not.toHaveBeenCalled();
    expect(result.current.activeError).toBe('No se pudo consultar.');

    await act(async () => {
      await result.current.handleSelectPeriod('8');
    });

    expect(toastError).toHaveBeenCalled();
  });
});
