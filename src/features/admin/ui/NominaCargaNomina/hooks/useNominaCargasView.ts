'use client';

import { useCallback, useState } from 'react';
import { useNominaCatalogo } from '@/features/admin/hooks/useNominaCatalogo';
import { useNominaStaging } from '@/features/admin/hooks/useNominaStaging';
import { useAuth } from '@/features/auth/context/auth.context';
import type { NominaCargaEntity } from '../types/nomina-cargas.types';
import { useNominaCargaExecution } from './useNominaCargaExecution';
import { useNominaCargaUploadModal } from './useNominaCargaUploadModal';

export function useNominaCargasView() {
  const { sesion } = useAuth();
  const catalogo = useNominaCatalogo();
  const nomina = useNominaStaging();

  const [activeEntity, setActiveEntity] = useState<NominaCargaEntity>('catalogo');
  const [searchFileId, setSearchFileId] = useState('');
  const [consultMessage, setConsultMessage] = useState<string | null>(null);

  const handleSelectEntity = useCallback((entity: NominaCargaEntity) => {
    setActiveEntity(entity);
    setSearchFileId('');
    setConsultMessage(null);
  }, []);

  const execution = useNominaCargaExecution({
    activeEntity,
    searchFileId,
    catalogo,
    nomina,
    setConsultMessage,
  });

  const uploadModal = useNominaCargaUploadModal({
    activeEntity,
    catalogo,
    nomina,
    userId: sesion?.userId,
  });

  return {
    activeEntity,
    searchFileId,
    setSearchFileId,
    consultMessage,
    handleSelectEntity,

    catalogo,
    nomina,

    ...execution,
    ...uploadModal,
  };
}
