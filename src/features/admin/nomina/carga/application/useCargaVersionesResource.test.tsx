import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { VersionNominaDto } from '@/features/admin/nomina/shared/model/versiones.types';
import { ApiError } from '@/lib/api/api.errors';

import { useCargaVersionesResource } from './useCargaVersionesResource';

vi.mock('@/features/admin/nomina/configuracion/api/versiones', () => ({
  listarVersionesNomina: vi.fn(),
}));

import { listarVersionesNomina } from '@/features/admin/nomina/configuracion/api/versiones';

const mockedListarVersionesNomina = vi.mocked(listarVersionesNomina);

const versiones: VersionNominaDto[] = [
  {
    versionId: 4,
    payPeriodId: 1,
    periodCode: '042026',
    stage: 'PREVIA',
    status: 'LOADED',
    isCurrent: true,
    released: false,
    notes: '',
    loadedAt: '2026-04-28T12:00:00Z',
  },
];

describe('useCargaVersionesResource', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads versions on mount and exposes the result', async () => {
    mockedListarVersionesNomina.mockResolvedValueOnce(versiones);

    const { result } = renderHook(() => useCargaVersionesResource());

    await waitFor(() => {
      expect(result.current.lista).toEqual(versiones);
    });

    expect(result.current.loadingLista).toBe(false);
    expect(result.current.errorLista).toBeNull();
    expect(mockedListarVersionesNomina).toHaveBeenCalledTimes(1);
  });

  it('keeps the previous data and exposes an error when reload fails', async () => {
    mockedListarVersionesNomina.mockResolvedValueOnce(versiones);

    const { result } = renderHook(() => useCargaVersionesResource());

    await waitFor(() => {
      expect(result.current.lista).toEqual(versiones);
    });

    mockedListarVersionesNomina.mockRejectedValueOnce(
      new ApiError({ message: 'Fallo', status: 500 })
    );

    await act(async () => {
      await expect(result.current.cargarLista()).rejects.toBeInstanceOf(ApiError);
    });

    await waitFor(() => {
      expect(result.current.errorLista).toBeTruthy();
    });

    expect(result.current.lista).toEqual(versiones);
    expect(result.current.loadingLista).toBe(false);
  });
});
