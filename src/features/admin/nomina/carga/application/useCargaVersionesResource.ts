'use client';

import { useCallback, useEffect, useState } from 'react';

import { listarVersionesNomina } from '@/features/admin/nomina/configuracion/api/versiones';
import {
  errorState,
  idleState,
  loadingState,
  successState,
  type AsyncState,
} from '@/features/admin/nomina/shared/lib/request-state';
import type { VersionNominaDto } from '@/features/admin/nomina/shared/model/versiones.types';
import { toErrorMessage } from '@/lib/api/api.errors';

export function useCargaVersionesResource() {
  const [lista, setLista] = useState<AsyncState<VersionNominaDto[]>>(idleState([]));

  const cargarLista = useCallback(async () => {
    try {
      setLista((current) => loadingState(current.data ?? []));
      const response = await listarVersionesNomina();
      setLista(successState(response));
      return response;
    } catch (error) {
      const message = toErrorMessage(error, 'No se pudo cargar la lista de versiones.');
      setLista((current) => errorState(message, current.data ?? []));
      throw error;
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void cargarLista();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [cargarLista]);

  return {
    lista: lista.data ?? [],
    loadingLista: lista.loading,
    errorLista: lista.error,
    cargarLista,
  };
}
