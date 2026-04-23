'use client';

import { useCallback, useState } from 'react';
import { toErrorMessage } from '@/lib/api/api.errores';
import {
  obtenerAuditoriaCancelaciones,
  obtenerAuditoriaLiberaciones,
} from '../services/nomina-auditoria.service';
import {
  errorState,
  idleState,
  loadingState,
  successState,
  type AsyncState,
} from './request-state';
import type {
  AuditCancellationsQuery,
  AuditCancellationsResponseDto,
  AuditReleasesQuery,
  AuditReleasesResponseDto,
} from '../types/nomina-auditoria.types';

export function useNominaAuditoria() {
  const [releases, setReleases] = useState<AsyncState<AuditReleasesResponseDto>>(idleState());
  const [cancellations, setCancellations] =
    useState<AsyncState<AuditCancellationsResponseDto>>(idleState());

  const consultarLiberaciones = useCallback(async (query?: AuditReleasesQuery) => {
    try {
      setReleases((current) => loadingState(current.data));
      const response = await obtenerAuditoriaLiberaciones(query);
      setReleases(successState(response));
      return response;
    } catch (e) {
      const message = toErrorMessage(e, 'No se pudo consultar la auditoria de liberaciones');
      setReleases((current) => errorState(message, current.data));
      throw e;
    }
  }, []);

  const consultarCancelaciones = useCallback(async (query?: AuditCancellationsQuery) => {
    try {
      setCancellations((current) => loadingState(current.data));
      const response = await obtenerAuditoriaCancelaciones(query);
      setCancellations(successState(response));
      return response;
    } catch (e) {
      const message = toErrorMessage(e, 'No se pudo consultar la auditoria de cancelaciones');
      setCancellations((current) => errorState(message, current.data));
      throw e;
    }
  }, []);

  const resetLiberaciones = useCallback(() => setReleases(idleState()), []);
  const resetCancelaciones = useCallback(() => setCancellations(idleState()), []);

  return {
    releases,
    cancellations,
    consultarLiberaciones,
    consultarCancelaciones,
    resetLiberaciones,
    resetCancelaciones,
  };
}
