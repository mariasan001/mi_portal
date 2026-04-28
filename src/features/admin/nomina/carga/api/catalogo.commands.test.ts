import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/lib/api/api.errors';
import { API_RUTAS } from '@/lib/api/api.routes';

import { ejecutarCargaCatalogo, subirArchivoNomina } from './catalogo.commands';

describe('carga/api/catalogo.commands', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('uploads payroll files as FormData with credentials included', async () => {
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          fileId: 10,
          versionId: 4,
          fileType: 'CATALOGO',
          fileName: 'catalogo.dbf',
          filePath: '/tmp/catalogo.dbf',
          checksumSha256: 'abc',
          fileSizeBytes: 200,
          status: 'UPLOADED',
          uploadedAt: '2026-01-01T00:00:00',
        }),
        {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }
      )
    );

    const file = new File(['demo'], 'catalogo.dbf', {
      type: 'application/octet-stream',
    });

    const result = await subirArchivoNomina({
      versionId: 4,
      fileType: 'CATALOGO',
      createdByUserId: 25,
      file,
    });

    expect(result.fileId).toBe(10);
    expect(fetchMock).toHaveBeenCalledWith(
      API_RUTAS.nomina.uploadArchivo,
      expect.objectContaining({
        method: 'POST',
        cache: 'no-store',
        credentials: 'include',
      })
    );

    const form = fetchMock.mock.calls[0]?.[1]?.body as FormData;
    expect(form.get('versionId')).toBe('4');
    expect(form.get('fileType')).toBe('CATALOGO');
    expect(form.get('createdByUserId')).toBe('25');
    expect(form.get('file')).toBeInstanceOf(File);
  });

  it('throws ApiError when upload fails', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'Upload fallo' }), {
        status: 422,
        headers: { 'content-type': 'application/json' },
      })
    );

    const file = new File(['demo'], 'catalogo.dbf');

    await expect(
      subirArchivoNomina({
        versionId: 4,
        fileType: 'CATALOGO',
        file,
      })
    ).rejects.toEqual(
      expect.objectContaining<ApiError>({
        name: 'ApiError',
        message: 'Upload fallo',
        status: 422,
        url: API_RUTAS.nomina.uploadArchivo,
      })
    );
  });

  it('executes catalog processing with POST and shared defaults', async () => {
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          executionId: 99,
          fileId: 18,
          jobName: 'catalog-job',
        }),
        {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }
      )
    );

    const result = await ejecutarCargaCatalogo(18);

    expect(result.executionId).toBe(99);
    expect(fetchMock).toHaveBeenCalledWith(
      API_RUTAS.nomina.ejecutarCatalogo(18),
      expect.objectContaining({
        method: 'POST',
        cache: 'no-store',
        credentials: 'include',
        headers: { accept: 'application/json' },
      })
    );
  });
});
