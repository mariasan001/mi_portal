import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ArchivoNominaDto } from '@/features/admin/nomina/shared/model/catalogo.types';

import { useCargaExecution } from './useCargaExecution';

const toastSuccess = vi.fn();
const toastError = vi.fn();
const toastInfo = vi.fn();
const setBackgroundTask = vi.fn();

vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccess(...args),
    error: (...args: unknown[]) => toastError(...args),
    info: (...args: unknown[]) => toastInfo(...args),
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

function createResources() {
  return {
    catalogo: {
      loadingUpload: false,
      loadingRun: false,
      runCatalogo: vi.fn().mockResolvedValue({ executionId: 1, fileId: 99, jobName: 'catalogo' }),
    },
    files: {
      loadingLista: false,
      errorLista: null,
      cargarLista: vi.fn().mockResolvedValue([]),
    },
    nomina: {
      loadingRun: false,
      runStaging: vi.fn().mockResolvedValue({ executionId: 10, fileId: 1, jobName: 'staging' }),
    },
  };
}

const file = (overrides: Partial<ArchivoNominaDto>): ArchivoNominaDto => ({
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
  ...overrides,
});

describe('useCargaExecution', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('executes a single catalog file and refreshes the list', async () => {
    const resources = createResources();

    const { result } = renderHook(() =>
      useCargaExecution({
        activeEntity: 'catalogo',
        catalogo: resources.catalogo as never,
        files: resources.files as never,
        nomina: resources.nomina as never,
      })
    );

    await act(async () => {
      await result.current.handleExecuteFile(99, 'CATALOGO');
    });

    expect(resources.catalogo.runCatalogo).toHaveBeenCalledWith(99);
    expect(resources.files.cargarLista).toHaveBeenCalled();
    expect(setBackgroundTask).toHaveBeenCalled();
    expect(toastSuccess).toHaveBeenCalled();
  });

  it('executes only pending files in a nomina group', async () => {
    const resources = createResources();
    const items = [
      file({ fileId: 1, fileType: 'TCOMP', status: 'UPLOADED' }),
      file({ fileId: 2, fileType: 'TCALC', status: 'PROCESSED' }),
      file({ fileId: 3, fileType: 'HNCOMADI', status: 'UPLOADED' }),
    ];

    const { result } = renderHook(() =>
      useCargaExecution({
        activeEntity: 'nomina',
        catalogo: resources.catalogo as never,
        files: resources.files as never,
        nomina: resources.nomina as never,
      })
    );

    await act(async () => {
      await result.current.handleExecuteGroup(items);
    });

    expect(resources.nomina.runStaging).toHaveBeenCalledTimes(2);
    expect(resources.nomina.runStaging).toHaveBeenNthCalledWith(1, 1);
    expect(resources.nomina.runStaging).toHaveBeenNthCalledWith(2, 3);
    expect(resources.files.cargarLista).toHaveBeenCalled();
    expect(toastSuccess).toHaveBeenCalled();
  });

  it('shows an info toast when there are no pending files in the group', async () => {
    const resources = createResources();
    const items = [
      file({ fileId: 1, status: 'PROCESSED' }),
      file({ fileId: 2, status: 'PROCESSING' }),
    ];

    const { result } = renderHook(() =>
      useCargaExecution({
        activeEntity: 'nomina',
        catalogo: resources.catalogo as never,
        files: resources.files as never,
        nomina: resources.nomina as never,
      })
    );

    await act(async () => {
      await result.current.handleExecuteGroup(items);
    });

    expect(resources.nomina.runStaging).not.toHaveBeenCalled();
    expect(toastInfo).toHaveBeenCalled();
  });
});
