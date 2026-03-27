'use client';

import { useCallback, useState } from 'react';
import { toErrorMessage } from '@/lib/api/api.errores';
import {
  generarRecibos,
  generarSnapshots,
  liberarVersionRecibos,
  sincronizarVersionCore,
} from '../services/nomina-recibos.service';
import type {
  CoreSyncResponseDto,
  GenerarRecibosResponseDto,
  GenerarSnapshotsResponseDto,
  LiberarVersionPayload,
  LiberarVersionResponseDto,
} from '../types/nomina-recibos.types';

type ActionState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

type UseNominaRecibosReturn = {
  snapshots: ActionState<GenerarSnapshotsResponseDto>;
  receipts: ActionState<GenerarRecibosResponseDto>;
  release: ActionState<LiberarVersionResponseDto>;
  coreSync: ActionState<CoreSyncResponseDto>;

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

export function useNominaRecibos(): UseNominaRecibosReturn {
  const [snapshots, setSnapshots] = useState<ActionState<GenerarSnapshotsResponseDto>>({
    data: null,
    loading: false,
    error: null,
  });

  const [receipts, setReceipts] = useState<ActionState<GenerarRecibosResponseDto>>({
    data: null,
    loading: false,
    error: null,
  });

  const [release, setRelease] = useState<ActionState<LiberarVersionResponseDto>>({
    data: null,
    loading: false,
    error: null,
  });

  const [coreSync, setCoreSync] = useState<ActionState<CoreSyncResponseDto>>({
    data: null,
    loading: false,
    error: null,
  });

  const ejecutarSnapshots = useCallback(async (versionId: number) => {
    try {
      setSnapshots({ data: null, loading: true, error: null });
      const response = await generarSnapshots(versionId);
      setSnapshots({ data: response, loading: false, error: null });
      return response;
    } catch (e) {
      const message = toErrorMessage(e, 'No se pudieron generar los snapshots');
      setSnapshots({ data: null, loading: false, error: message });
      throw e;
    }
  }, []);

  const ejecutarRecibos = useCallback(async (versionId: number) => {
    try {
      setReceipts({ data: null, loading: true, error: null });
      const response = await generarRecibos(versionId);
      setReceipts({ data: response, loading: false, error: null });
      return response;
    } catch (e) {
      const message = toErrorMessage(e, 'No se pudieron generar los recibos');
      setReceipts({ data: null, loading: false, error: message });
      throw e;
    }
  }, []);

  const ejecutarLiberacion = useCallback(
    async (versionId: number, payload: LiberarVersionPayload) => {
      try {
        setRelease({ data: null, loading: true, error: null });
        const response = await liberarVersionRecibos(versionId, payload);
        setRelease({ data: response, loading: false, error: null });
        return response;
      } catch (e) {
        const message = toErrorMessage(e, 'No se pudo liberar la versión');
        setRelease({ data: null, loading: false, error: message });
        throw e;
      }
    },
    []
  );

  const ejecutarCoreSync = useCallback(async (versionId: number) => {
    try {
      setCoreSync({ data: null, loading: true, error: null });
      const response = await sincronizarVersionCore(versionId);
      setCoreSync({ data: response, loading: false, error: null });
      return response;
    } catch (e) {
      const message = toErrorMessage(e, 'No se pudo sincronizar la versión a core');
      setCoreSync({ data: null, loading: false, error: message });
      throw e;
    }
  }, []);

  const resetSnapshots = useCallback(() => {
    setSnapshots({ data: null, loading: false, error: null });
  }, []);

  const resetRecibos = useCallback(() => {
    setReceipts({ data: null, loading: false, error: null });
  }, []);

  const resetRelease = useCallback(() => {
    setRelease({ data: null, loading: false, error: null });
  }, []);

  const resetCoreSync = useCallback(() => {
    setCoreSync({ data: null, loading: false, error: null });
  }, []);

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