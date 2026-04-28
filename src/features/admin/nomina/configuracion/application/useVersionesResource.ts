'use client';

import { useCallback, useEffect, useState } from 'react';

import { toErrorMessage } from '@/lib/api/api.errors';

import {
  crearVersionNomina,
  listarVersionesNomina,
} from '@/features/admin/nomina/configuracion/api/versiones';
import {
  errorState,
  idleState,
  loadingState,
  successState,
  type AsyncState,
} from '@/features/admin/nomina/shared/lib/request-state';
import type {
  CrearVersionNominaPayload,
  VersionNominaDto,
} from '@/features/admin/nomina/shared/model/versiones.types';

export function useVersionesResource() {
  const [lista, setLista] = useState<AsyncState<VersionNominaDto[]>>(idleState([]));
  const [detalle, setDetalle] = useState<AsyncState<VersionNominaDto>>(idleState());
  const [creacion, setCreacion] = useState<AsyncState<VersionNominaDto>>(idleState());

  const cargarLista = useCallback(async () => {
    try {
      setLista((current) => loadingState(current.data ?? []));
      const response = await listarVersionesNomina();
      setLista(successState(response));

      setDetalle((current) => {
        if (current.data) {
          const updated =
            response.find((item) => item.versionId === current.data?.versionId) ??
            current.data;
          return successState(updated);
        }

        return response[0] ? successState(response[0]) : idleState();
      });

      return response;
    } catch (error) {
      const message = toErrorMessage(error, 'No se pudo cargar la lista de versiones.');
      setLista((current) => errorState(message, current.data ?? []));
      throw error;
    }
  }, []);

  const crearVersion = useCallback(
    async (payload: CrearVersionNominaPayload) => {
      try {
        setCreacion((current) => loadingState(current.data));
        const response = await crearVersionNomina(payload);
        setCreacion(successState(response));
        setDetalle(successState(response));
        await cargarLista();
        return response;
      } catch (error) {
        const message = toErrorMessage(error, 'No se pudo crear la versión.');
        setCreacion((current) => errorState(message, current.data));
        throw error;
      }
    },
    [cargarLista]
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void cargarLista();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [cargarLista]);

  function seleccionarDetalle(item: VersionNominaDto) {
    setDetalle(successState(item));
  }

  return {
    lista: lista.data ?? [],
    detalle: detalle.data,
    loadingLista: lista.loading,
    loadingCreate: creacion.loading,
    errorLista: lista.error,
    errorCreate: creacion.error,
    cargarLista,
    seleccionarDetalle,
    crearVersion,
  };
}
