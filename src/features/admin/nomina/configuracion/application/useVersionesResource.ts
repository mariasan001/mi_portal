'use client';

import { useCallback, useEffect, useState } from 'react';
import { toErrorMessage } from '@/lib/api/api.errors';
import {
  crearVersionNomina,
  listarVersionesNomina,
  obtenerVersionNomina,
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
  const [ultimaCreada, setUltimaCreada] = useState<AsyncState<VersionNominaDto>>(idleState());

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
    } catch (e) {
      const message = toErrorMessage(e, 'No se pudo cargar la lista de versiones');
      setLista((current) => errorState(message, current.data ?? []));
      throw e;
    }
  }, []);

  const consultarPorId = useCallback(async (versionId: number) => {
    try {
      setDetalle((current) => loadingState(current.data));
      const response = await obtenerVersionNomina(versionId);
      setDetalle(successState(response));
      setLista((current) => {
        const data = current.data ?? [];
        const exists = data.some((item) => item.versionId === response.versionId);
        const next = exists
          ? data.map((item) =>
              item.versionId === response.versionId ? { ...item, ...response } : item
            )
          : [response, ...data];
        return successState(next);
      });
      return response;
    } catch (e) {
      const message = toErrorMessage(e, 'No se pudo consultar la version');
      setDetalle((current) => errorState(message, current.data));
      throw e;
    }
  }, []);

  const crearVersion = useCallback(async (payload: CrearVersionNominaPayload) => {
    try {
      setUltimaCreada((current) => loadingState(current.data));
      const response = await crearVersionNomina(payload);
      setUltimaCreada(successState(response));
      setDetalle(successState(response));
      await cargarLista();
      return response;
    } catch (e) {
      const message = toErrorMessage(e, 'No se pudo crear la version');
      setUltimaCreada((current) => errorState(message, current.data));
      throw e;
    }
  }, [cargarLista]);

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
    ultimaCreada: ultimaCreada.data,
    loadingLista: lista.loading,
    loadingDetalle: detalle.loading,
    loadingCreate: ultimaCreada.loading,
    errorLista: lista.error,
    errorDetalle: detalle.error,
    errorCreate: ultimaCreada.error,
    cargarLista,
    seleccionarDetalle,
    consultarPorId,
    crearVersion,
  };
}
