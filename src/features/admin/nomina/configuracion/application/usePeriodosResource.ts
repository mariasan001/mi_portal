'use client';

import { useCallback, useEffect, useState } from 'react';

import { toErrorMessage } from '@/lib/api/api.errors';

import {
  crearORecuperarPeriodoNomina,
  listarPeriodosNomina,
} from '@/features/admin/nomina/configuracion/api/periodos';
import type {
  CrearPeriodoNominaPayload,
  PeriodoNominaDto,
} from '@/features/admin/nomina/shared/model/periodos.types';

export function usePeriodosResource() {
  const [lista, setLista] = useState<PeriodoNominaDto[]>([]);
  const [detalle, setDetalle] = useState<PeriodoNominaDto | null>(null);

  const [loadingLista, setLoadingLista] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);

  const [errorLista, setErrorLista] = useState<string | null>(null);
  const [errorCreate, setErrorCreate] = useState<string | null>(null);

  const cargarLista = useCallback(async () => {
    try {
      setLoadingLista(true);
      setErrorLista(null);

      const response = await listarPeriodosNomina();
      setLista(response);

      setDetalle((current) => {
        if (current) {
          return response.find((item) => item.periodId === current.periodId) ?? current;
        }

        return response[0] ?? null;
      });

      return response;
    } catch (error) {
      const message = toErrorMessage(error, 'No se pudo cargar la lista de períodos.');
      setErrorLista(message);
      throw error;
    } finally {
      setLoadingLista(false);
    }
  }, []);

  const crearPeriodo = useCallback(
    async (payload: CrearPeriodoNominaPayload) => {
      try {
        setLoadingCreate(true);
        setErrorCreate(null);

        const response = await crearORecuperarPeriodoNomina(payload);
        setDetalle(response);
        await cargarLista();

        return response;
      } catch (error) {
        const message = toErrorMessage(
          error,
          'No se pudo crear o recuperar el período.'
        );
        setErrorCreate(message);
        throw error;
      } finally {
        setLoadingCreate(false);
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

  function seleccionarDetalle(item: PeriodoNominaDto) {
    setDetalle(item);
  }

  return {
    lista,
    detalle,
    loadingLista,
    loadingCreate,
    errorLista,
    errorCreate,
    cargarLista,
    seleccionarDetalle,
    crearPeriodo,
  };
}
