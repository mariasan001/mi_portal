'use client';

import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';

import type { useCatalogoResource } from './useCatalogoResource';
import type { useStagingResource } from './useStagingResource';
import type { NominaCargaEntity } from '../model/carga.types';

type CatalogoState = ReturnType<typeof useCatalogoResource>;
type NominaState = ReturnType<typeof useStagingResource>;

type Params = {
  activeEntity: NominaCargaEntity;
  searchFileId: string;
  catalogo: CatalogoState;
  nomina: NominaState;
};

export function useCargaExecution({
  activeEntity,
  searchFileId,
  catalogo,
  nomina,
}: Params) {
  const activeError = useMemo(() => {
    if (activeEntity === 'catalogo') {
      return catalogo.errorUpload ?? catalogo.errorRun ?? null;
    }

    return nomina.errorRun ?? null;
  }, [activeEntity, catalogo.errorRun, catalogo.errorUpload, nomina.errorRun]);

  const currentLoading = useMemo(() => {
    if (activeEntity === 'catalogo') {
      return catalogo.loadingUpload || catalogo.loadingRun;
    }

    return nomina.loadingRun;
  }, [activeEntity, catalogo.loadingRun, catalogo.loadingUpload, nomina.loadingRun]);

  const canSearch = useMemo(
    () => Number(searchFileId) > 0 && !currentLoading,
    [currentLoading, searchFileId]
  );

  const canExecute = canSearch;

  const handleExecute = useCallback(async () => {
    const parsedFileId = Number(searchFileId);

    if (!Number.isFinite(parsedFileId) || parsedFileId <= 0) {
      toast.warning('Captura un fileId válido.');
      return;
    }

    try {
      if (activeEntity === 'catalogo') {
        await catalogo.runCatalogo(parsedFileId);
        toast.success('Carga de catálogo ejecutada correctamente.');
        return;
      }

      await nomina.runStaging(parsedFileId);
      toast.success('Staging de nómina ejecutado correctamente.');
    } catch {
      if (activeEntity === 'catalogo') {
        toast.error('No se pudo ejecutar la carga de catálogo.');
        return;
      }

      toast.error('No se pudo ejecutar el staging de nómina.');
    }
  }, [activeEntity, catalogo, nomina, searchFileId]);

  const shouldDimContent = useMemo(() => {
    if (activeEntity === 'catalogo') {
      return !catalogo.archivo && !catalogo.ejecucion;
    }

    return !nomina.ejecucion;
  }, [activeEntity, catalogo.archivo, catalogo.ejecucion, nomina.ejecucion]);

  return {
    activeError,
    currentLoading,
    canSearch,
    canExecute,
    shouldDimContent,
    handleExecute,
  };
}
