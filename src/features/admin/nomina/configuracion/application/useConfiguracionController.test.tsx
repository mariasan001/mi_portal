import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
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

import { toast } from 'sonner';
import { useAuth } from '@/features/auth/context/auth.context';

import { usePeriodosResource } from './usePeriodosResource';
import { useVersionesResource } from './useVersionesResource';
import { useConfiguracionController } from './useConfiguracionController';

const mockedToast = vi.mocked(toast);
const mockedUseAuth = vi.mocked(useAuth);
const mockedUsePeriodosResource = vi.mocked(usePeriodosResource);
const mockedUseVersionesResource = vi.mocked(useVersionesResource);

function buildPeriodosResource() {
  return {
    detalle: null,
    ultimoCreado: null,
    loadingDetalle: false,
    loadingCreate: false,
    errorDetalle: null,
    errorCreate: null,
    consultarPorId: vi.fn(),
    crearPeriodo: vi.fn(),
  };
}

function buildVersionesResource() {
  return {
    detalle: null,
    ultimaCreada: null,
    loadingDetalle: false,
    loadingCreate: false,
    errorDetalle: null,
    errorCreate: null,
    consultarPorId: vi.fn(),
    crearVersion: vi.fn(),
  };
}

describe('useConfiguracionController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseAuth.mockReturnValue({
      sesion: { userId: 25 },
    } as ReturnType<typeof useAuth>);
  });

  it('warns when the search id is invalid', async () => {
    mockedUsePeriodosResource.mockReturnValue(buildPeriodosResource());
    mockedUseVersionesResource.mockReturnValue(buildVersionesResource());

    const { result } = renderHook(() => useConfiguracionController());

    await act(async () => {
      result.current.setSearchId('0');
      await result.current.handleSearch();
    });

    expect(mockedToast.warning).toHaveBeenCalledWith('Captura un periodId valido.');
  });

  it('searches periods by default and reports success', async () => {
    const periodos = buildPeriodosResource();
    periodos.consultarPorId.mockResolvedValue({ periodId: 10 });
    mockedUsePeriodosResource.mockReturnValue(periodos);
    mockedUseVersionesResource.mockReturnValue(buildVersionesResource());

    const { result } = renderHook(() => useConfiguracionController());

    act(() => {
      result.current.setSearchId('10');
    });

    await act(async () => {
      await result.current.handleSearch();
    });

    expect(periodos.consultarPorId).toHaveBeenCalledWith(10);
    expect(mockedToast.success).toHaveBeenCalledWith(
      'Periodo consultado correctamente.'
    );
  });

  it('switches entity, resets search state and closes the modal', () => {
    mockedUsePeriodosResource.mockReturnValue(buildPeriodosResource());
    mockedUseVersionesResource.mockReturnValue(buildVersionesResource());

    const { result } = renderHook(() => useConfiguracionController());

    act(() => {
      result.current.setSearchId('55');
      result.current.openCreateModal();
      result.current.handleSelectEntity('version');
    });

    expect(result.current.activeEntity).toBe('version');
    expect(result.current.searchId).toBe('');
    expect(result.current.isCreateModalOpen).toBe(false);
  });

  it('creates a version using the authenticated user id', async () => {
    const versiones = buildVersionesResource();
    versiones.crearVersion.mockResolvedValue({ versionId: 1 });
    mockedUsePeriodosResource.mockReturnValue(buildPeriodosResource());
    mockedUseVersionesResource.mockReturnValue(versiones);

    const { result } = renderHook(() => useConfiguracionController());

    await act(async () => {
      result.current.handleSelectEntity('version');
      result.current.openCreateModal();
      await result.current.handleCreateVersion({
        payPeriodId: 4,
        stage: 'PREVIA',
        notes: 'nota',
      });
    });

    expect(versiones.crearVersion).toHaveBeenCalledWith({
      payPeriodId: 4,
      stage: 'PREVIA',
      notes: 'nota',
      createdByUserId: 25,
    });
    expect(result.current.isCreateModalOpen).toBe(false);
    expect(mockedToast.success).toHaveBeenCalledWith('Version creada correctamente.');
  });

  it('rejects version creation when the authenticated user is missing', async () => {
    mockedUseAuth.mockReturnValue({
      sesion: { userId: 0 },
    } as ReturnType<typeof useAuth>);
    mockedUsePeriodosResource.mockReturnValue(buildPeriodosResource());
    mockedUseVersionesResource.mockReturnValue(buildVersionesResource());

    const { result } = renderHook(() => useConfiguracionController());

    await act(async () => {
      result.current.handleSelectEntity('version');
      await result.current.handleCreateVersion({
        payPeriodId: 4,
        stage: 'PREVIA',
        notes: 'nota',
      });
    });

    expect(mockedToast.error).toHaveBeenCalledWith(
      'No se pudo identificar al usuario autenticado.'
    );
  });
});
