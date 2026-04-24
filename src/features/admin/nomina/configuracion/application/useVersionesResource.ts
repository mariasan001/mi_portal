'use client';

import { useCallback, useState } from 'react';
import { toErrorMessage } from '@/lib/api/api.errors';
import {
  crearVersionNomina,
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
  const [detalle, setDetalle] = useState<AsyncState<VersionNominaDto>>(idleState());
  const [ultimaCreada, setUltimaCreada] = useState<AsyncState<VersionNominaDto>>(idleState());

  const consultarPorId = useCallback(async (versionId: number) => {
    try {
      setDetalle((current) => loadingState(current.data));
      const response = await obtenerVersionNomina(versionId);
      setDetalle(successState(response));
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
      return response;
    } catch (e) {
      const message = toErrorMessage(e, 'No se pudo crear la version');
      setUltimaCreada((current) => errorState(message, current.data));
      throw e;
    }
  }, []);

  return {
    detalle: detalle.data,
    ultimaCreada: ultimaCreada.data,
    loadingDetalle: detalle.loading,
    loadingCreate: ultimaCreada.loading,
    errorDetalle: detalle.error,
    errorCreate: ultimaCreada.error,
    consultarPorId,
    crearVersion,
  };
}
