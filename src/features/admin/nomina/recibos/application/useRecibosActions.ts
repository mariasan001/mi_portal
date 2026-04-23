'use client';

import { useCallback, useState } from 'react';
import { toErrorMessage } from '@/lib/api/api.errores';
import {
  errorState,
  idleState,
  loadingState,
  successState,
  type AsyncState,
} from '@/features/admin/hooks/request-state';
import {
  generarRecibos,
  generarSnapshots,
  liberarVersionRecibos,
  sincronizarVersionCore,
} from '../api/commands';
import type {
  CoreSyncResponseDto,
  GenerarRecibosResponseDto,
  GenerarSnapshotsResponseDto,
  LiberarVersionPayload,
  LiberarVersionResponseDto,
} from '../model/recibos.types';

export type UseRecibosActionsReturn = {
  snapshots: AsyncState<GenerarSnapshotsResponseDto>;
  receipts: AsyncState<GenerarRecibosResponseDto>;
  release: AsyncState<LiberarVersionResponseDto>;
  coreSync: AsyncState<CoreSyncResponseDto>;
  ejecutarSnapshots: (versionId: number) => Promise<GenerarSnapshotsResponseDto>;
  ejecutarRecibos: (versionId: number) => Promise<GenerarRecibosResponseDto>;
  ejecutarLiberacion: (
    versionId: number,
    payload: LiberarVersionPayload
  ) => Promise<LiberarVersionResponseDto>;
  ejecutarCoreSync: (versionId: number) => Promise<CoreSyncResponseDto>;
  resetSnapshots: () => void;
  resetRecibos: () => void;
  resetRelease: () => void;
  resetCoreSync: () => void;
};

export function useRecibosActions(): UseRecibosActionsReturn {
  const [snapshots, setSnapshots] =
    useState<AsyncState<GenerarSnapshotsResponseDto>>(idleState());
  const [receipts, setReceipts] =
    useState<AsyncState<GenerarRecibosResponseDto>>(idleState());
  const [release, setRelease] =
    useState<AsyncState<LiberarVersionResponseDto>>(idleState());
  const [coreSync, setCoreSync] =
    useState<AsyncState<CoreSyncResponseDto>>(idleState());

  const ejecutarSnapshots = useCallback(async (versionId: number) => {
    try {
      setSnapshots(loadingState());
      const response = await generarSnapshots(versionId);
      setSnapshots(successState(response));
      return response;
    } catch (e) {
      const message = toErrorMessage(e, 'No se pudieron generar los snapshots');
      setSnapshots(errorState(message));
      throw e;
    }
  }, []);

  const ejecutarRecibos = useCallback(async (versionId: number) => {
    try {
      setReceipts(loadingState());
      const response = await generarRecibos(versionId);
      setReceipts(successState(response));
      return response;
    } catch (e) {
      const message = toErrorMessage(e, 'No se pudieron generar los recibos');
      setReceipts(errorState(message));
      throw e;
    }
  }, []);

  const ejecutarLiberacion = useCallback(
    async (versionId: number, payload: LiberarVersionPayload) => {
      try {
        setRelease(loadingState());
        const response = await liberarVersionRecibos(versionId, payload);
        setRelease(successState(response));
        return response;
      } catch (e) {
        const message = toErrorMessage(e, 'No se pudo liberar la version');
        setRelease(errorState(message));
        throw e;
      }
    },
    []
  );

  const ejecutarCoreSync = useCallback(async (versionId: number) => {
    try {
      setCoreSync(loadingState());
      const response = await sincronizarVersionCore(versionId);
      setCoreSync(successState(response));
      return response;
    } catch (e) {
      const message = toErrorMessage(e, 'No se pudo sincronizar la version a core');
      setCoreSync(errorState(message));
      throw e;
    }
  }, []);

  const resetSnapshots = useCallback(() => setSnapshots(idleState()), []);
  const resetRecibos = useCallback(() => setReceipts(idleState()), []);
  const resetRelease = useCallback(() => setRelease(idleState()), []);
  const resetCoreSync = useCallback(() => setCoreSync(idleState()), []);

  return {
    snapshots,
    receipts,
    release,
    coreSync,
    ejecutarSnapshots,
    ejecutarRecibos,
    ejecutarLiberacion,
    ejecutarCoreSync,
    resetSnapshots,
    resetRecibos,
    resetRelease,
    resetCoreSync,
  };
}
