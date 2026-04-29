import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ArchivoNominaDto } from '@/features/admin/nomina/shared/model/catalogo.types';
import { ApiError } from '@/lib/api/api.errors';

import { useNominaFilesResource } from './useNominaFilesResource';

vi.mock('../api/files.queries', () => ({
  listarArchivosNomina: vi.fn(),
}));

import { listarArchivosNomina } from '../api/files.queries';

const mockedListarArchivosNomina = vi.mocked(listarArchivosNomina);

const files: ArchivoNominaDto[] = [
  {
    fileId: 1,
    versionId: 4,
    payPeriodId: 1,
    periodCode: '042026',
    stage: 'PREVIA',
    fileType: 'TCOMP',
    fileName: 'tcomp0426.dbf',
    filePath: 'C:\\files\\tcomp0426.dbf',
    checksumSha256: 'abc',
    fileSizeBytes: 100,
    rowCount: 20,
    status: 'UPLOADED',
    uploadedAt: '2026-04-28T12:00:00Z',
  },
];

describe('useNominaFilesResource', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads files on mount and exposes them', async () => {
    mockedListarArchivosNomina.mockResolvedValueOnce(files);

    const { result } = renderHook(() => useNominaFilesResource());

    await waitFor(() => {
      expect(result.current.lista).toEqual(files);
    });

    expect(result.current.loadingLista).toBe(false);
    expect(result.current.errorLista).toBeNull();
    expect(mockedListarArchivosNomina).toHaveBeenCalledTimes(1);
  });

  it('keeps the current list and exposes an error when reload fails', async () => {
    mockedListarArchivosNomina.mockResolvedValueOnce(files);

    const { result } = renderHook(() => useNominaFilesResource());

    await waitFor(() => {
      expect(result.current.lista).toEqual(files);
    });

    mockedListarArchivosNomina.mockRejectedValueOnce(
      new ApiError({ message: 'Conflict', status: 409 })
    );

    await act(async () => {
      await expect(result.current.cargarLista()).rejects.toBeInstanceOf(ApiError);
    });

    await waitFor(() => {
      expect(result.current.errorLista).toBeTruthy();
    });

    expect(result.current.lista).toEqual(files);
    expect(result.current.loadingLista).toBe(false);
  });
});
