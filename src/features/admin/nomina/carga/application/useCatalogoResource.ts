'use client';

import { useCallback, useState } from 'react';
import { toErrorMessage } from '@/lib/api/api.errores';
import {
  ejecutarCargaCatalogo,
  subirArchivoNomina,
} from '@/features/admin/nomina/carga/api/catalogo.commands';
import {
  errorState,
  idleState,
  loadingState,
  successState,
  type AsyncState,
} from '@/features/admin/hooks/request-state';
import type {
  ArchivoNominaDto,
  EjecucionCatalogoDto,
  UploadArchivoNominaPayload,
} from '@/features/admin/types/nomina-catalogo.types';

export function useCatalogoResource() {
  const [archivo, setArchivo] = useState<AsyncState<ArchivoNominaDto>>(idleState());
  const [ejecucion, setEjecucion] = useState<AsyncState<EjecucionCatalogoDto>>(idleState());

  const uploadArchivo = useCallback(async (payload: UploadArchivoNominaPayload) => {
    try {
      setArchivo(loadingState());
      const response = await subirArchivoNomina(payload);
      setArchivo(successState(response));
      return response;
    } catch (e) {
      const message = toErrorMessage(e, 'No se pudo subir el archivo');
      setArchivo(errorState(message));
      throw e;
    }
  }, []);

  const runCatalogo = useCallback(async (fileId: number) => {
    try {
      setEjecucion(loadingState());
      const response = await ejecutarCargaCatalogo(fileId);
      setEjecucion(successState(response));
      return response;
    } catch (e) {
      const message = toErrorMessage(e, 'No se pudo ejecutar la carga');
      setEjecucion(errorState(message));
      throw e;
    }
  }, []);

  return {
    archivo: archivo.data,
    ejecucion: ejecucion.data,
    loadingUpload: archivo.loading,
    loadingRun: ejecucion.loading,
    errorUpload: archivo.error,
    errorRun: ejecucion.error,
    uploadArchivo,
    runCatalogo,
  };
}
