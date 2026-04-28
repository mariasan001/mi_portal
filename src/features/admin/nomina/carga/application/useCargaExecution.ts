'use client';

import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';

import type { useCatalogoResource } from './useCatalogoResource';
import type { useNominaFilesResource } from './useNominaFilesResource';
import type { useStagingResource } from './useStagingResource';
import type { NominaCargaEntity } from '../model/carga.types';

type CatalogoState = ReturnType<typeof useCatalogoResource>;
type FilesState = ReturnType<typeof useNominaFilesResource>;
type NominaState = ReturnType<typeof useStagingResource>;

type Params = {
  activeEntity: NominaCargaEntity;
  catalogo: CatalogoState;
  files: FilesState;
  nomina: NominaState;
};

export function useCargaExecution({
  activeEntity,
  catalogo,
  files,
  nomina,
}: Params) {
  const activeError = useMemo(() => {
    if (activeEntity === 'catalogo') {
      return catalogo.errorUpload ?? catalogo.errorRun ?? files.errorLista ?? null;
    }

    return nomina.errorRun ?? files.errorLista ?? null;
  }, [activeEntity, catalogo.errorRun, catalogo.errorUpload, files.errorLista, nomina.errorRun]);

  const currentLoading = useMemo(() => {
    if (activeEntity === 'catalogo') {
      return catalogo.loadingUpload || catalogo.loadingRun || files.loadingLista;
    }

    return nomina.loadingRun || files.loadingLista;
  }, [activeEntity, catalogo.loadingRun, catalogo.loadingUpload, files.loadingLista, nomina.loadingRun]);

  const handleExecuteFile = useCallback(async (fileId: number) => {
    try {
      if (activeEntity === 'catalogo') {
        await catalogo.runCatalogo(fileId);
        await files.cargarLista();
        toast.success('Carga de catálogo ejecutada correctamente.');
        return;
      }

      await nomina.runStaging(fileId);
      await files.cargarLista();
      toast.success('Staging de nómina ejecutado correctamente.');
    } catch {
      if (activeEntity === 'catalogo') {
        toast.error('No se pudo ejecutar la carga de catálogo.');
        return;
      }

      toast.error('No se pudo ejecutar el staging de nómina.');
    }
  }, [activeEntity, catalogo, files, nomina]);

  return {
    activeError,
    currentLoading,
    handleExecuteFile,
  };
}
