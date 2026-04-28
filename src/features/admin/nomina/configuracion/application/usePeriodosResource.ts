'use client';

import { useCallback, useEffect, useState } from 'react';
import { toErrorMessage } from '@/lib/api/api.errors';
import {
  crearORecuperarPeriodoNomina,
  listarPeriodosNomina,
  obtenerPeriodoNomina,
} from '@/features/admin/nomina/configuracion/api/periodos';
import type {
  CrearPeriodoNominaPayload,
  PeriodoNominaDto,
} from '@/features/admin/nomina/shared/model/periodos.types';

export function usePeriodosResource() {
  const [lista, setLista] = useState<PeriodoNominaDto[]>([]);
  const [detalle, setDetalle] = useState<PeriodoNominaDto | null>(null);
  const [ultimoCreado, setUltimoCreado] = useState<PeriodoNominaDto | null>(null);

  const [loadingLista, setLoadingLista] = useState(false);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);

  const [errorLista, setErrorLista] = useState<string | null>(null);
  const [errorDetalle, setErrorDetalle] = useState<string | null>(null);
  const [errorCreate, setErrorCreate] = useState<string | null>(null);

  const cargarLista = useCallback(async () => {
    try {
      setLoadingLista(true);
      setErrorLista(null);

      const response = await listarPeriodosNomina();
      setLista(response);

      setDetalle((current) => {
        if (current) {
          return (
            response.find((item) => item.periodId === current.periodId) ?? current
          );
        }

        return response[0] ?? null;
      });

      return response;
    } catch (e) {
      const message = toErrorMessage(e, 'No se pudo cargar la lista de periodos');
      setErrorLista(message);
      throw e;
    } finally {
      setLoadingLista(false);
    }
  }, []);

  const consultarPorId = useCallback(async (periodId: number) => {
    try {
      setLoadingDetalle(true);
      setErrorDetalle(null);

      const response = await obtenerPeriodoNomina(periodId);
      setDetalle(response);
      setLista((current) => {
        const exists = current.some((item) => item.periodId === response.periodId);
        if (exists) {
          return current.map((item) =>
            item.periodId === response.periodId ? { ...item, ...response } : item
          );
        }

        return [response, ...current];
      });

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
      setDetalle(response);
      await cargarLista();

      return response;
    } catch (e) {
      const message = toErrorMessage(e, 'No se pudo crear o recuperar el periodo');
      setErrorCreate(message);
      throw e;
    } finally {
      setLoadingCreate(false);
    }
  }, [cargarLista]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void cargarLista();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [cargarLista]);

  function seleccionarDetalle(item: PeriodoNominaDto) {
    setDetalle(item);
  }

  return {
    lista,
    detalle,
    ultimoCreado,
    loadingLista,
    loadingDetalle,
    loadingCreate,
    errorLista,
    errorDetalle,
    errorCreate,
    cargarLista,
    seleccionarDetalle,
    consultarPorId,
    crearPeriodo,
  };
}
