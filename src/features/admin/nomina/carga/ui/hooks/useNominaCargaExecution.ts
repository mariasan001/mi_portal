'use client';

import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import type { useCatalogoResource } from '@/features/admin/nomina/carga/application/useCatalogoResource';
import type { useStagingResource } from '@/features/admin/nomina/carga/application/useStagingResource';
import type { NominaCargaEntity } from '../types/nomina-cargas.types';

type CatalogoState = ReturnType<typeof useCatalogoResource>;
type NominaState = ReturnType<typeof useStagingResource>;

type Params = {
  activeEntity: NominaCargaEntity;
  searchFileId: string;
  catalogo: CatalogoState;
  nomina: NominaState;
  setConsultMessage: (message: string | null) => void;
};

export function useNominaCargaExecution({
  activeEntity,
  searchFileId,
  catalogo,
  nomina,
  setConsultMessage,
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

  const canSearch = useMemo(() => Number(searchFileId) > 0 && !currentLoading, [currentLoading, searchFileId]);
  const canExecute = canSearch;

  const handleConsult = useCallback(async () => {
    const parsedFileId = Number(searchFileId);

    if (!Number.isFinite(parsedFileId) || parsedFileId <= 0) {
      toast.warning('Captura un fileId valido.');
      return;
    }

    setConsultMessage(
      `La busqueda por fileId (${parsedFileId}) ya quedo preparada en la UI. Solo falta conectar el endpoint real de consulta.`
    );

    toast.message('Consulta preparada visualmente.', {
      description: 'Falta enlazar el endpoint real para recuperar el detalle por fileId.',
    });
  }, [searchFileId, setConsultMessage]);

  const handleExecute = useCallback(async () => {
    const parsedFileId = Number(searchFileId);

    if (!Number.isFinite(parsedFileId) || parsedFileId <= 0) {
      toast.warning('Captura un fileId valido.');
      return;
    }

    try {
      if (activeEntity === 'catalogo') {
        await catalogo.runCatalogo(parsedFileId);
        toast.success('Carga de catalogo ejecutada correctamente.');
        return;
      }

      await nomina.runStaging(parsedFileId);
      toast.success('Staging de nomina ejecutado correctamente.');
    } catch {
      if (activeEntity === 'catalogo') {
        toast.error('No se pudo ejecutar la carga de catalogo.');
        return;
      }

      toast.error('No se pudo ejecutar el staging de nomina.');
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
    handleConsult,
    handleExecute,
  };
}
