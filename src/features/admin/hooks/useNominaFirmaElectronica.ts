'use client';

import { useCallback, useState } from 'react';
import { toErrorMessage } from '@/lib/api/api.errores';
import {
  crearSolicitudFirma,
  listarSolicitudesFirma,
  obtenerDetalleSolicitudFirma,
  obtenerDetalleTecnicoFirma,
} from '../services/firma-electronica.service';
import type {
  CrearSolicitudFirmaPayload,
  CrearSolicitudFirmaResultDto,
  FirmaDetalleTecnicoDto,
  SignatureApiResponse,
  SignatureRequestStatus,
  SolicitudFirmaDetalleDto,
  SolicitudFirmaListItemDto,
} from '../types/firma-electronica.types';

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

export function useNominaFirmaElectronica() {
  const [creacion, setCreacion] = useState<
    AsyncState<SignatureApiResponse<CrearSolicitudFirmaResultDto>>
  >(createInitialState());

  const [listado, setListado] = useState<
    AsyncState<SignatureApiResponse<SolicitudFirmaListItemDto[]>>
  >(createInitialState());

  const [detalle, setDetalle] = useState<
    AsyncState<SignatureApiResponse<SolicitudFirmaDetalleDto>>
  >(createInitialState());

  const [detalleTecnico, setDetalleTecnico] = useState<
    AsyncState<SignatureApiResponse<FirmaDetalleTecnicoDto>>
  >(createInitialState());

  const ejecutarCreacion = useCallback(
    async (payload: CrearSolicitudFirmaPayload) => {
      try {
        setCreacion({ data: null, loading: true, error: null });

        const response = await crearSolicitudFirma(payload);

        setCreacion({ data: response, loading: false, error: null });
        return response;
      } catch (e) {
        const message = toErrorMessage(e, 'No se pudo crear la solicitud');
        setCreacion({ data: null, loading: false, error: message });
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

        setListado({ data: response, loading: false, error: null });
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

      setDetalle({ data: response, loading: false, error: null });
      return response;
    } catch (e) {
      const message = toErrorMessage(e, 'No se pudo consultar el detalle');
      setDetalle({ data: null, loading: false, error: message });
      throw e;
    }
  }, []);

  const consultarDetalleTecnico = useCallback(async (requestId: string) => {
    try {
      setDetalleTecnico({ data: null, loading: true, error: null });

      const response = await obtenerDetalleTecnicoFirma(requestId);

      setDetalleTecnico({ data: response, loading: false, error: null });
      return response;
    } catch (e) {
      const message = toErrorMessage(
        e,
        'No se pudo consultar el detalle técnico'
      );
      setDetalleTecnico({ data: null, loading: false, error: message });
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