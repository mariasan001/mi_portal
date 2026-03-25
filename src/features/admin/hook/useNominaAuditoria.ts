'use client';

import { useCallback, useState } from 'react';
import { toErrorMessage } from '@/lib/api/api.errores';
import {
  obtenerAuditoriaCancelaciones,
  obtenerAuditoriaLiberaciones,
} from '../services/nomina-auditoria.service';
import type {
  AuditCancellationsQuery,
  AuditCancellationsResponseDto,
  AuditReleasesQuery,
  AuditReleasesResponseDto,
} from '../types/nomina-auditoria.types';

type QueryState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useNominaAuditoria() {
  const [releases, setReleases] = useState<QueryState<AuditReleasesResponseDto>>({
    data: null,
    loading: false,
    error: null,
  });

  const [cancellations, setCancellations] = useState<QueryState<AuditCancellationsResponseDto>>({
    data: null,
    loading: false,
    error: null,
  });

  const consultarLiberaciones = useCallback(
    async (query?: AuditReleasesQuery) => {
      try {
        setReleases({ data: null, loading: true, error: null });
        const response = await obtenerAuditoriaLiberaciones(query);
        setReleases({ data: response, loading: false, error: null });
        return response;
      } catch (e) {
        const message = toErrorMessage(e, 'No se pudo consultar la auditoría de liberaciones');
        setReleases({ data: null, loading: false, error: message });
        throw e;
      }
    },
    []
  );

  const consultarCancelaciones = useCallback(
    async (query?: AuditCancellationsQuery) => {
      try {
        setCancellations({ data: null, loading: true, error: null });
        const response = await obtenerAuditoriaCancelaciones(query);
        setCancellations({ data: response, loading: false, error: null });
        return response;
      } catch (e) {
        const message = toErrorMessage(e, 'No se pudo consultar la auditoría de cancelaciones');
        setCancellations({ data: null, loading: false, error: message });
        throw e;
      }
    },
    []
  );

  const resetLiberaciones = useCallback(() => {
    setReleases({ data: null, loading: false, error: null });
  }, []);

  const resetCancelaciones = useCallback(() => {
    setCancellations({ data: null, loading: false, error: null });
  }, []);

  return {
    releases,
    cancellations,
    consultarLiberaciones,
    consultarCancelaciones,
    resetLiberaciones,
    resetCancelaciones,
  };
}