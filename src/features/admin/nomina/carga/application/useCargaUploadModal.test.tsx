import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { toast } from 'sonner';

import { useCargaUploadModal } from './useCargaUploadModal';

const mockedToast = vi.mocked(toast);

function buildCatalogoState() {
  return {
    loadingUpload: false,
    loadingRun: false,
    uploadArchivo: vi.fn(),
    runCatalogo: vi.fn(),
  };
}

function buildNominaState() {
  return {
    loadingRun: false,
    runStaging: vi.fn(),
  };
}

describe('useCargaUploadModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('opens with the default fileType based on the active entity', () => {
    const { result } = renderHook(() =>
      useCargaUploadModal({
        activeEntity: 'nomina',
        catalogo: buildCatalogoState(),
        nomina: buildNominaState(),
        userId: 10,
      })
    );

    act(() => {
      result.current.openUploadModal();
    });

    expect(result.current.isUploadModalOpen).toBe(true);
    expect(result.current.modalForm.fileType).toBe('TCOMP');
  });

  it('validates versionId before starting the upload', async () => {
    const { result } = renderHook(() =>
      useCargaUploadModal({
        activeEntity: 'catalogo',
        catalogo: buildCatalogoState(),
        nomina: buildNominaState(),
        userId: 10,
      })
    );

    await act(async () => {
      await result.current.handleUploadAndRun();
    });

    expect(result.current.modalError).toBe('Captura un versionId válido.');
  });

  it('uploads and runs the catalog flow successfully', async () => {
    const catalogo = buildCatalogoState();
    catalogo.uploadArchivo.mockResolvedValue({ fileId: 41 });
    catalogo.runCatalogo.mockResolvedValue({ executionId: 5 });
    const file = new File(['dbf'], 'catalogo.dbf');

    const { result } = renderHook(() =>
      useCargaUploadModal({
        activeEntity: 'catalogo',
        catalogo,
        nomina: buildNominaState(),
        userId: 10,
      })
    );

    act(() => {
      result.current.openUploadModal();
      result.current.updateModalField('versionId', '8');
      result.current.updateModalField('file', file);
    });

    await act(async () => {
      await result.current.handleUploadAndRun();
    });

    expect(catalogo.uploadArchivo).toHaveBeenCalledWith({
      versionId: 8,
      fileType: 'CATALOGO',
      createdByUserId: 10,
      file,
    });
    expect(catalogo.runCatalogo).toHaveBeenCalledWith(41);
    expect(result.current.modalStatus).toBe('success');
    expect(mockedToast.success).toHaveBeenCalledWith(
      'Catálogo cargado y ejecutado correctamente.'
    );
  });

  it('runs payroll staging after a successful upload for nomina files', async () => {
    const catalogo = buildCatalogoState();
    const nomina = buildNominaState();
    catalogo.uploadArchivo.mockResolvedValue({ fileId: 52 });
    nomina.runStaging.mockResolvedValue({ executionId: 6 });
    const file = new File(['dbf'], 'nomina.dbf');

    const { result } = renderHook(() =>
      useCargaUploadModal({
        activeEntity: 'nomina',
        catalogo,
        nomina,
        userId: 18,
      })
    );

    act(() => {
      result.current.openUploadModal();
      result.current.updateModalField('versionId', '9');
      result.current.updateModalField('file', file);
    });

    await act(async () => {
      await result.current.handleUploadAndRun();
    });

    expect(nomina.runStaging).toHaveBeenCalledWith(52);
    expect(mockedToast.success).toHaveBeenCalledWith(
      'Archivo de nómina cargado y ejecutado correctamente.'
    );
  });
});
