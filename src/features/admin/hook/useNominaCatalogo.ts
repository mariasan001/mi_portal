'use client';

import { useCallback, useState } from 'react';
import { toErrorMessage } from '@/lib/api/api.errores';
import {
  ejecutarCargaCatalogo,
  subirArchivoNomina,
} from '../services/nomina-catalogo.service';
import type {
  ArchivoNominaDto,
  EjecucionCatalogoDto,
  UploadArchivoNominaPayload,
} from '../types/nomina-catalogo.types';

export function useNominaCatalogo() {
  const [archivo, setArchivo] = useState<ArchivoNominaDto | null>(null);
  const [ejecucion, setEjecucion] = useState<EjecucionCatalogoDto | null>(null);

  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingRun, setLoadingRun] = useState(false);

  const [errorUpload, setErrorUpload] = useState<string | null>(null);
  const [errorRun, setErrorRun] = useState<string | null>(null);

  const uploadArchivo = useCallback(async (payload: UploadArchivoNominaPayload) => {
    try {
      setLoadingUpload(true);
      setErrorUpload(null);

      const response = await subirArchivoNomina(payload);
      setArchivo(response);

      return response;
    } catch (e) {
      const message = toErrorMessage(e, 'No se pudo subir el archivo');
      setErrorUpload(message);
      throw e;
    } finally {
      setLoadingUpload(false);
    }
  }, []);

  const runCatalogo = useCallback(async (fileId: number) => {
    try {
      setLoadingRun(true);
      setErrorRun(null);

      const response = await ejecutarCargaCatalogo(fileId);
      setEjecucion(response);

      return response;
    } catch (e) {
      const message = toErrorMessage(e, 'No se pudo ejecutar la carga');
      setErrorRun(message);
      throw e;
    } finally {
      setLoadingRun(false);
    }
  }, []);

  return {
    archivo,
    ejecucion,

    loadingUpload,
    loadingRun,

    errorUpload,
    errorRun,

    uploadArchivo,
    runCatalogo,
  };
}