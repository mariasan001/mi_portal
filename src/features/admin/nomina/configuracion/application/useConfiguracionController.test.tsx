import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { PeriodoNominaDto } from '@/features/admin/nomina/shared/model/periodos.types';
import type { VersionNominaDto } from '@/features/admin/nomina/shared/model/versiones.types';

import { useConfiguracionController } from './useConfiguracionController';

const toastSuccess = vi.fn();
const toastError = vi.fn();

const periodoDetalle: PeriodoNominaDto = {
  periodId: 1,
  anio: 2026,
  quincena: 1,
  periodoCode: '012026',
  fechaInicio: '2026-01-01',
  fechaFin: '2026-01-15',
  fechaPagoEstimada: '2026-01-16',
};

const versionDetalle: VersionNominaDto = {
  versionId: 10,
  payPeriodId: 1,
  periodCode: '012026',
  anio: 2026,
  quincena: 1,
  stage: 'PREVIA',
  status: 'LOADED',
  isCurrent: true,
  released: false,
  notes: '',
  loadedAt: '2026-01-20T10:00:00',
};

const mockPeriodos = {
  lista: [periodoDetalle],
  detalle: periodoDetalle,
  loadingCreate: false,
  errorLista: null,
  errorCreate: null,
  seleccionarDetalle: vi.fn(),
  crearPeriodo: vi.fn(),
};

const mockVersiones = {
  lista: [versionDetalle],
  detalle: versionDetalle,
  loadingCreate: false,
  errorLista: null,
  errorCreate: null,
  seleccionarDetalle: vi.fn(),
  crearVersion: vi.fn(),
};

vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccess(...args),
    error: (...args: unknown[]) => toastError(...args),
  },
}));

vi.mock('@/features/auth/context/auth.context', () => ({
  useAuth: vi.fn(),
}));

vi.mock('./usePeriodosResource', () => ({
  usePeriodosResource: vi.fn(),
}));

vi.mock('./useVersionesResource', () => ({
  useVersionesResource: vi.fn(),
}));

import { useAuth } from '@/features/auth/context/auth.context';
import { usePeriodosResource } from './usePeriodosResource';
import { useVersionesResource } from './useVersionesResource';

const mockedUseAuth = vi.mocked(useAuth);
const mockedUsePeriodosResource = vi.mocked(usePeriodosResource);
const mockedUseVersionesResource = vi.mocked(useVersionesResource);

describe('useConfiguracionController', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseAuth.mockReturnValue({
      sesion: { userId: 77 },
    } as never);

    mockedUsePeriodosResource.mockReturnValue(mockPeriodos as never);
    mockedUseVersionesResource.mockReturnValue(mockVersiones as never);
  });

  it('starts in period mode and exposes the active error by entity', () => {
    const { result } = renderHook(() => useConfiguracionController());

    expect(result.current.activeEntity).toBe('periodo');
    expect(result.current.activeError).toBeNull();
  });

  it('changes entity and closes the modal when switching tabs', () => {
    const { result } = renderHook(() => useConfiguracionController());

    act(() => {
      result.current.openCreateModal();
      result.current.handleSelectEntity('version');
    });

    expect(result.current.activeEntity).toBe('version');
    expect(result.current.isCreateModalOpen).toBe(false);
  });

  it('delegates period and version selection to the resources', () => {
    const { result } = renderHook(() => useConfiguracionController());

    act(() => {
      result.current.handleSelectPeriodo(periodoDetalle);
      result.current.handleSelectVersion(versionDetalle);
    });

    expect(mockPeriodos.seleccionarDetalle).toHaveBeenCalledWith(periodoDetalle);
    expect(mockVersiones.seleccionarDetalle).toHaveBeenCalledWith(versionDetalle);
  });

  it('creates a period and shows a success toast', async () => {
    mockPeriodos.crearPeriodo.mockResolvedValueOnce(periodoDetalle);

    const { result } = renderHook(() => useConfiguracionController());

    act(() => {
      result.current.openCreateModal();
    });

    await act(async () => {
      await result.current.handleCreatePeriodo({
        anio: 2026,
        quincena: 1,
        fechaInicio: '2026-01-01',
        fechaFin: '2026-01-15',
        fechaPagoEstimada: '2026-01-16',
      });
    });

    expect(mockPeriodos.crearPeriodo).toHaveBeenCalled();
    expect(toastSuccess).toHaveBeenCalled();
    expect(result.current.isCreateModalOpen).toBe(false);
  });

  it('blocks version creation when the authenticated user is missing', async () => {
    mockedUseAuth.mockReturnValue({
      sesion: null,
    } as never);

    const { result } = renderHook(() => useConfiguracionController());

    await act(async () => {
      await result.current.handleCreateVersion({
        payPeriodId: 1,
        stage: 'PREVIA',
        notes: 'x',
      });
    });

    expect(mockVersiones.crearVersion).not.toHaveBeenCalled();
    expect(toastError).toHaveBeenCalledWith(
      'No se pudo identificar al usuario autenticado.'
    );
  });

  it('injects the authenticated user id when creating a version', async () => {
    mockVersiones.crearVersion.mockResolvedValueOnce(versionDetalle);

    const { result } = renderHook(() => useConfiguracionController());

    act(() => {
      result.current.handleSelectEntity('version');
      result.current.openCreateModal();
    });

    await act(async () => {
      await result.current.handleCreateVersion({
        payPeriodId: 1,
        stage: 'INTEGRADA',
        notes: 'ok',
      });
    });

    expect(mockVersiones.crearVersion).toHaveBeenCalledWith({
      payPeriodId: 1,
      stage: 'INTEGRADA',
      notes: 'ok',
      createdByUserId: 77,
    });
    expect(toastSuccess).toHaveBeenCalled();
    expect(result.current.isCreateModalOpen).toBe(false);
  });
});
