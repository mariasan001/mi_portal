'use client';

import { useCallback, useState } from 'react';
import { toErrorMessage } from '@/lib/api/api.errores';
import {
  crearSolicitudFirma,
  listarSolicitudesFirma,
  obtenerDetalleSolicitudFirma,
  obtenerDetalleTecnicoFirma,
} from '@/features/admin/nomina/firma-electronica/api/firma-electronica.commands';
import type {
  CrearSolicitudFirmaPayload,
  CrearSolicitudFirmaResultDto,
  FirmaDetalleTecnicoDto,
  SignatureRequestStatus,
  SolicitudFirmaDetalleDto,
  SolicitudFirmaListItemDto,
} from '@/features/admin/nomina/firma-electronica/model/firma-electronica.types';

type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

function createInitialState<T>(): AsyncState<T> {
  return {
    data: null,
    loading: false,
    error: null,
  };
}

export function useFirmaElectronicaResource() {
  const [creacion, setCreacion] = useState<
    AsyncState<CrearSolicitudFirmaResultDto>
  >(createInitialState());

  const [listado, setListado] = useState<
    AsyncState<SolicitudFirmaListItemDto[]>
  >(createInitialState());

  const [detalle, setDetalle] = useState<
    AsyncState<SolicitudFirmaDetalleDto>
  >(createInitialState());

  const [detalleTecnico, setDetalleTecnico] = useState<
    AsyncState<FirmaDetalleTecnicoDto>
  >(createInitialState());

  const ejecutarCreacion = useCallback(
    async (payload: CrearSolicitudFirmaPayload) => {
      try {
        setCreacion({ data: null, loading: true, error: null });

        const response = await crearSolicitudFirma(payload);

        setCreacion({
          data: response,
          loading: false,
          error: null,
        });

        return response;
      } catch (e) {
        const message = toErrorMessage(e, 'No se pudo crear la solicitud');

        setCreacion({
          data: null,
          loading: false,
          error: message,
        });

        throw e;
      }
    },
    []
  );

  const consultarListado = useCallback(
    async (status?: SignatureRequestStatus) => {
      try {
        setListado((current) => ({
          ...current,
          loading: true,
          error: null,
        }));

        const response = await listarSolicitudesFirma(status);

        setListado({
          data: response,
          loading: false,
          error: null,
        });

        return response;
      } catch (e) {
        const message = toErrorMessage(e, 'No se pudo consultar el listado');

        setListado((current) => ({
          ...current,
          loading: false,
          error: message,
        }));

        throw e;
      }
    },
    []
  );

  const consultarDetalle = useCallback(async (requestId: string) => {
    try {
      setDetalle({ data: null, loading: true, error: null });

      const response = await obtenerDetalleSolicitudFirma(requestId);

      setDetalle({
        data: response,
        loading: false,
        error: null,
      });

      return response;
    } catch (e) {
      const message = toErrorMessage(e, 'No se pudo consultar el detalle');

      setDetalle({
        data: null,
        loading: false,
        error: message,
      });

      throw e;
    }
  }, []);

  const consultarDetalleTecnico = useCallback(async (requestId: string) => {
    try {
      setDetalleTecnico({ data: null, loading: true, error: null });

      const response = await obtenerDetalleTecnicoFirma(requestId);

      setDetalleTecnico({
        data: response,
        loading: false,
        error: null,
      });

      return response;
    } catch (e) {
      const message = toErrorMessage(
        e,
        'No se pudo consultar el detalle tecnico'
      );

      setDetalleTecnico({
        data: null,
        loading: false,
        error: message,
      });

      throw e;
    }
  }, []);

  return {
    creacion,
    listado,
    detalle,
    detalleTecnico,
    ejecutarCreacion,
    consultarListado,
    consultarDetalle,
    consultarDetalleTecnico,
  };
}
