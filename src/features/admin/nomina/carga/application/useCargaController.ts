'use client';

import { useCallback, useState } from 'react';

import { useAuth } from '@/features/auth/context/auth.context';
import type { NominaCargaEntity } from '../model/carga.types';
import { useCatalogoResource } from './useCatalogoResource';
import { useCargaExecution } from './useCargaExecution';
import { useCargaFilesExplorer } from './useCargaFilesExplorer';
import { useCargaUploadModal } from './useCargaUploadModal';
import { useNominaFilesResource } from './useNominaFilesResource';
import { useCargaVersionesResource } from './useCargaVersionesResource';
import { useStagingResource } from './useStagingResource';

export function useCargaController() {
  const { sesion } = useAuth();
  const catalogo = useCatalogoResource();
  const nomina = useStagingResource();
  const archivos = useNominaFilesResource();
  const versiones = useCargaVersionesResource();

  const [activeEntity, setActiveEntity] = useState<NominaCargaEntity>('catalogo');

  const handleSelectEntity = useCallback((entity: NominaCargaEntity) => {
    setActiveEntity(entity);
  }, []);

  const filesExplorer = useCargaFilesExplorer(archivos.lista, activeEntity);

  const execution = useCargaExecution({
    activeEntity,
    catalogo,
    files: archivos,
    nomina,
  });

  const uploadModal = useCargaUploadModal({
    activeEntity,
    catalogo,
    files: archivos,
    nomina,
    versiones,
    userId: sesion?.userId,
  });

  return {
    activeEntity,
    handleSelectEntity,
    catalogo,
    nomina,
    archivos,
    versiones,
    filesExplorer,
    ...execution,
    ...uploadModal,
  };
}
