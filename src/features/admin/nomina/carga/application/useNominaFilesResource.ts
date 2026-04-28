'use client';

import { useCallback, useEffect, useState } from 'react';

import { toErrorMessage } from '@/lib/api/api.errors';

import { listarArchivosNomina } from '../api/files.queries';
import type { ArchivoNominaDto } from '@/features/admin/nomina/shared/model/catalogo.types';

export function useNominaFilesResource() {
  const [lista, setLista] = useState<ArchivoNominaDto[]>([]);
  const [loadingLista, setLoadingLista] = useState(false);
  const [errorLista, setErrorLista] = useState<string | null>(null);

  const cargarLista = useCallback(async () => {
    try {
      setLoadingLista(true);
      setErrorLista(null);

      const response = await listarArchivosNomina();
      setLista(response);
      return response;
    } catch (error) {
      const message = toErrorMessage(error, 'No se pudo cargar la lista de archivos.');
      setErrorLista(message);
      throw error;
    } finally {
      setLoadingLista(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void cargarLista();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [cargarLista]);

  return {
    lista,
    loadingLista,
    errorLista,
    cargarLista,
  };
}
