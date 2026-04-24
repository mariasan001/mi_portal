'use client';

import { useCallback, useState } from 'react';

import { useAuth } from '@/features/auth/context/auth.context';
import type { NominaCargaEntity } from '../model/carga.types';
import { useCatalogoResource } from './useCatalogoResource';
import { useCargaExecution } from './useCargaExecution';
import { useCargaUploadModal } from './useCargaUploadModal';
import { useStagingResource } from './useStagingResource';

export function useCargaController() {
  const { sesion } = useAuth();
  const catalogo = useCatalogoResource();
  const nomina = useStagingResource();

  const [activeEntity, setActiveEntity] = useState<NominaCargaEntity>('catalogo');
  const [searchFileId, setSearchFileId] = useState('');

  const handleSelectEntity = useCallback((entity: NominaCargaEntity) => {
    setActiveEntity(entity);
    setSearchFileId('');
  }, []);

  const execution = useCargaExecution({
    activeEntity,
    searchFileId,
    catalogo,
    nomina,
  });

  const uploadModal = useCargaUploadModal({
    activeEntity,
    catalogo,
    nomina,
    userId: sesion?.userId,
  });

  return {
    activeEntity,
    searchFileId,
    setSearchFileId,
    handleSelectEntity,
    catalogo,
    nomina,
    ...execution,
    ...uploadModal,
  };
}
