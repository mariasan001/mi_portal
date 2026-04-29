import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/lib/api/api.errors';
import type { ArchivoNominaDto } from '@/features/admin/nomina/shared/model/catalogo.types';
import type { VersionNominaDto } from '@/features/admin/nomina/shared/model/versiones.types';

import { useCargaUploadModal } from './useCargaUploadModal';

const toastSuccess = vi.fn();
const toastError = vi.fn();
const setBackgroundTask = vi.fn();

vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccess(...args),
    error: (...args: unknown[]) => toastError(...args),
  },
}));

vi.mock('@/features/admin/shared/context/admin-background-task.context', () => ({
  useAdminBackgroundTask: () => ({
    backgroundTask: {
      visible: false,
      title: '',
      detail: '',
      progress: 0,
      status: 'idle',
    },
    setBackgroundTask,
  }),
}));

const uploadedFile: ArchivoNominaDto = {
  fileId: 12,
  versionId: 4,
  payPeriodId: 1,
  periodCode: '042026',
  stage: 'PREVIA',
  fileType: 'TCOMP',
  fileName: 'tcomp0426.dbf',
  filePath: 'C:\\files\\tcomp0426.dbf',
  checksumSha256: 'abc',
  fileSizeBytes: 200,
  rowCount: 10,
  status: 'UPLOADED',
  uploadedAt: '2026-04-28T12:00:00Z',
};

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

function createResources() {
  return {
    catalogo: {
      loadingUpload: false,
      loadingRun: false,
      uploadArchivo: vi.fn().mockResolvedValue(uploadedFile),
      runCatalogo: vi.fn().mockResolvedValue({ executionId: 1, fileId: 12, jobName: 'catalogo' }),
    },
    files: {
      loadingLista: false,
      cargarLista: vi.fn().mockResolvedValue([uploadedFile]),
    },
    nomina: {
      loadingRun: false,
      runStaging: vi.fn().mockResolvedValue({ executionId: 20, fileId: 12, jobName: 'staging' }),
    },
    versiones: {
      lista: versiones,
      loadingLista: false,
      cargarLista: vi.fn().mockResolvedValue(versiones),
    },
  };
}

describe('useCargaUploadModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads versions when opening the modal and there is no cached list', () => {
    const resources = createResources();
    resources.versiones.lista = [];

    const { result } = renderHook(() =>
      useCargaUploadModal({
        activeEntity: 'catalogo',
        catalogo: resources.catalogo as never,
        files: resources.files as never,
        nomina: resources.nomina as never,
        versiones: resources.versiones as never,
        userId: 77,
      })
    );

    act(() => {
      result.current.openUploadModal();
    });

    expect(result.current.isUploadModalOpen).toBe(true);
    expect(resources.versiones.cargarLista).toHaveBeenCalled();
  });

  it('uploads nomina files without executing when using "Subir"', async () => {
    const resources = createResources();
    const fileA = new File(['a'], 'tcomp0426.dbf', { type: 'application/octet-stream' });
    const fileB = new File(['b'], 'tcalc0426.dbf', { type: 'application/octet-stream' });

    const { result } = renderHook(() =>
      useCargaUploadModal({
        activeEntity: 'nomina',
        catalogo: resources.catalogo as never,
        files: resources.files as never,
        nomina: resources.nomina as never,
        versiones: resources.versiones as never,
        userId: 77,
      })
    );

    act(() => {
      result.current.openUploadModal();
      result.current.updateModalField('versionId', '4');
      result.current.updateModalField('files', [fileA, fileB]);
    });

    await act(async () => {
      result.current.handleUploadOnly();
    });

    expect(resources.catalogo.uploadArchivo).toHaveBeenCalledTimes(2);
    expect(resources.catalogo.uploadArchivo).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ versionId: 4, fileType: 'TCOMP', createdByUserId: 77 })
    );
    expect(resources.catalogo.uploadArchivo).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ versionId: 4, fileType: 'TCALC', createdByUserId: 77 })
    );
    expect(resources.nomina.runStaging).not.toHaveBeenCalled();
    expect(resources.files.cargarLista).toHaveBeenCalled();
    expect(toastSuccess).toHaveBeenCalled();
    expect(result.current.isUploadModalOpen).toBe(false);
  });

  it('uploads and executes catalogo in background when using "Subir y ejecutar"', async () => {
    const resources = createResources();
    const file = new File(['a'], 'catalogo042026.dbf', { type: 'application/octet-stream' });

    const { result } = renderHook(() =>
      useCargaUploadModal({
        activeEntity: 'catalogo',
        catalogo: resources.catalogo as never,
        files: resources.files as never,
        nomina: resources.nomina as never,
        versiones: resources.versiones as never,
        userId: 77,
      })
    );

    act(() => {
      result.current.openUploadModal();
      result.current.updateModalField('versionId', '4');
      result.current.updateModalField('files', [file]);
    });

    await act(async () => {
      result.current.handleUploadAndRun();
    });

    expect(resources.catalogo.uploadArchivo).toHaveBeenCalledTimes(1);
    expect(resources.catalogo.runCatalogo).toHaveBeenCalledWith(uploadedFile.fileId);
    expect(setBackgroundTask).toHaveBeenCalled();
    expect(toastSuccess).toHaveBeenCalled();
  });

  it('shows a friendly conflict message for duplicate catalog uploads', async () => {
    const resources = createResources();
    resources.catalogo.uploadArchivo.mockRejectedValueOnce(
      new ApiError({ message: 'Conflict', status: 409 })
    );
    const file = new File(['a'], 'catalogo042026.dbf', { type: 'application/octet-stream' });

    const { result } = renderHook(() =>
      useCargaUploadModal({
        activeEntity: 'catalogo',
        catalogo: resources.catalogo as never,
        files: resources.files as never,
        nomina: resources.nomina as never,
        versiones: resources.versiones as never,
        userId: 77,
      })
    );

    act(() => {
      result.current.openUploadModal();
      result.current.updateModalField('versionId', '4');
      result.current.updateModalField('files', [file]);
    });

    await act(async () => {
      result.current.handleUploadOnly();
    });

    expect(result.current.modalStatus).toBe('error');
    expect(result.current.modalError).toBeTruthy();
    expect(toastError).toHaveBeenCalled();
  });
});
