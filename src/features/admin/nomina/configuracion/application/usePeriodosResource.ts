'use client';

import { useCallback, useState } from 'react';
import { toErrorMessage } from '@/lib/api/api.errores';
import {
  crearORecuperarPeriodoNomina,
  obtenerPeriodoNomina,
} from '@/features/admin/nomina/configuracion/api/periodos';
import type {
  CrearPeriodoNominaPayload,
  PeriodoNominaDto,
} from '@/features/admin/types/nomina-periodos.types';

export function usePeriodosResource() {
  const [detalle, setDetalle] = useState<PeriodoNominaDto | null>(null);
  const [ultimoCreado, setUltimoCreado] = useState<PeriodoNominaDto | null>(null);

  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);

  const [errorDetalle, setErrorDetalle] = useState<string | null>(null);
  const [errorCreate, setErrorCreate] = useState<string | null>(null);

  const consultarPorId = useCallback(async (periodId: number) => {
    try {
      setLoadingDetalle(true);
      setErrorDetalle(null);

      const response = await obtenerPeriodoNomina(periodId);
      setDetalle(response);

      return response;
    } catch (e) {
      const message = toErrorMessage(e, 'No se pudo consultar el periodo');
      setErrorDetalle(message);
      throw e;
    } finally {
      setLoadingDetalle(false);
    }
  }, []);

  const crearPeriodo = useCallback(async (payload: CrearPeriodoNominaPayload) => {
    try {
      setLoadingCreate(true);
      setErrorCreate(null);

      const response = await crearORecuperarPeriodoNomina(payload);
      setUltimoCreado(response);

      return response;
    } catch (e) {
      const message = toErrorMessage(e, 'No se pudo crear o recuperar el periodo');
      setErrorCreate(message);
      throw e;
    } finally {
      setLoadingCreate(false);
    }
  }, []);

  return {
    detalle,
    ultimoCreado,
    loadingDetalle,
    loadingCreate,
    errorDetalle,
    errorCreate,
    consultarPorId,
    crearPeriodo,
  };
}
