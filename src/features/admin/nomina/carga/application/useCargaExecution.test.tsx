import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('sonner', () => ({
  toast: {
    warning: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { toast } from 'sonner';

import { useCargaExecution } from './useCargaExecution';

const mockedToast = vi.mocked(toast);

function buildCatalogoState() {
  return {
    archivo: null,
    ejecucion: null,
    loadingUpload: false,
    loadingRun: false,
    errorUpload: null,
    errorRun: null,
    uploadArchivo: vi.fn(),
    runCatalogo: vi.fn(),
  };
}

function buildNominaState() {
  return {
    ejecucion: null,
    loadingRun: false,
    errorRun: null,
    runStaging: vi.fn(),
  };
}

describe('useCargaExecution', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('warns when fileId is invalid', async () => {
    const { result } = renderHook(() =>
      useCargaExecution({
        activeEntity: 'catalogo',
        searchFileId: '0',
        catalogo: buildCatalogoState(),
        nomina: buildNominaState(),
      })
    );

    await act(async () => {
      await result.current.handleExecute();
    });

    expect(mockedToast.warning).toHaveBeenCalledWith('Captura un fileId válido.');
  });

  it('executes catalog flow and shows success feedback', async () => {
    const catalogo = buildCatalogoState();
    catalogo.runCatalogo.mockResolvedValue({ executionId: 1 });

    const { result } = renderHook(() =>
      useCargaExecution({
        activeEntity: 'catalogo',
        searchFileId: '12',
        catalogo,
        nomina: buildNominaState(),
      })
    );

    await act(async () => {
      await result.current.handleExecute();
    });

    expect(catalogo.runCatalogo).toHaveBeenCalledWith(12);
    expect(mockedToast.success).toHaveBeenCalledWith(
      'Carga de catálogo ejecutada correctamente.'
    );
  });

  it('executes payroll staging flow and shows success feedback', async () => {
    const nomina = buildNominaState();
    nomina.runStaging.mockResolvedValue({ executionId: 2 });

    const { result } = renderHook(() =>
      useCargaExecution({
        activeEntity: 'nomina',
        searchFileId: '15',
        catalogo: buildCatalogoState(),
        nomina,
      })
    );

    await act(async () => {
      await result.current.handleExecute();
    });

    expect(nomina.runStaging).toHaveBeenCalledWith(15);
    expect(mockedToast.success).toHaveBeenCalledWith(
      'Staging de nómina ejecutado correctamente.'
    );
  });

  it('exposes state flags according to the active entity', () => {
    const catalogo = buildCatalogoState();
    catalogo.loadingUpload = true;
    catalogo.errorUpload = 'fallo upload';

    const { result } = renderHook(() =>
      useCargaExecution({
        activeEntity: 'catalogo',
        searchFileId: '9',
        catalogo,
        nomina: buildNominaState(),
      })
    );

    expect(result.current.currentLoading).toBe(true);
    expect(result.current.activeError).toBe('fallo upload');
    expect(result.current.canSearch).toBe(false);
    expect(result.current.shouldDimContent).toBe(true);
  });
});
