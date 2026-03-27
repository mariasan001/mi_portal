'use client';

import { useCallback, useState } from 'react';
import { toErrorMessage } from '@/lib/api/api.errores';
import {
  crearVersionNomina,
  obtenerVersionNomina,
} from '../services/nomina-versiones.service';
import type {
  CrearVersionNominaPayload,
  VersionNominaDto,
} from '../types/nomina-versiones.types';

export function useNominaVersiones() {
  const [detalle, setDetalle] = useState<VersionNominaDto | null>(null);
  const [ultimaCreada, setUltimaCreada] = useState<VersionNominaDto | null>(null);

  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);

  const [errorDetalle, setErrorDetalle] = useState<string | null>(null);
  const [errorCreate, setErrorCreate] = useState<string | null>(null);

  const consultarPorId = useCallback(async (versionId: number) => {
    try {
      setLoadingDetalle(true);
      setErrorDetalle(null);

      const response = await obtenerVersionNomina(versionId);
      setDetalle(response);

      return response;
    } catch (e) {
      const message = toErrorMessage(e, 'No se pudo consultar la versión');
      setErrorDetalle(message);
      throw e;
    } finally {
      setLoadingDetalle(false);
    }
  }, []);

  const crearVersion = useCallback(async (payload: CrearVersionNominaPayload) => {
    try {
      setLoadingCreate(true);
      setErrorCreate(null);

      const response = await crearVersionNomina(payload);
      setUltimaCreada(response);

      return response;
    } catch (e) {
      const message = toErrorMessage(e, 'No se pudo crear la versión');
      setErrorCreate(message);
      throw e;
    } finally {
      setLoadingCreate(false);
    }
  }, []);

  return {
    detalle,
    ultimaCreada,

    loadingDetalle,
    loadingCreate,

    errorDetalle,
    errorCreate,

    consultarPorId,
    crearVersion,
  };
}