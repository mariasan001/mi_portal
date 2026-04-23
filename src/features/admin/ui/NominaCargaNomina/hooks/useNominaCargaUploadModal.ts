'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import type { useCatalogoResource } from '@/features/admin/nomina/carga/application/useCatalogoResource';
import type { useStagingResource } from '@/features/admin/nomina/carga/application/useStagingResource';
import type { NominaFileType } from '@/features/admin/types/nomina-catalogo.types';
import type {
  CatalogoModalForm,
  NominaCargaEntity,
  NominaCargaModalStatus,
} from '../types/nomina-cargas.types';

type CatalogoState = ReturnType<typeof useCatalogoResource>;
type NominaState = ReturnType<typeof useStagingResource>;

const INITIAL_MODAL_FORM: CatalogoModalForm = {
  versionId: '',
  fileType: 'CATALOGO',
  file: null,
};

type Params = {
  activeEntity: NominaCargaEntity;
  catalogo: CatalogoState;
  nomina: NominaState;
  userId?: number | null;
};

export function useNominaCargaUploadModal({
  activeEntity,
  catalogo,
  nomina,
  userId,
}: Params) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [modalForm, setModalForm] = useState<CatalogoModalForm>(INITIAL_MODAL_FORM);
  const [modalStatus, setModalStatus] = useState<NominaCargaModalStatus>('idle');
  const [modalError, setModalError] = useState<string | null>(null);

  const openUploadModal = useCallback(() => {
    setModalForm({
      versionId: '',
      fileType: activeEntity === 'catalogo' ? 'CATALOGO' : 'TCOMP',
      file: null,
    });
    setModalStatus('idle');
    setModalError(null);
    setIsUploadModalOpen(true);
  }, [activeEntity]);

  const closeUploadModal = useCallback(() => {
    const isBusy = catalogo.loadingUpload || catalogo.loadingRun || nomina.loadingRun;

    if (isBusy) return;

    setIsUploadModalOpen(false);
    setModalStatus('idle');
    setModalError(null);
  }, [catalogo.loadingRun, catalogo.loadingUpload, nomina.loadingRun]);

  const updateModalField = useCallback(
    <K extends keyof CatalogoModalForm>(key: K, value: CatalogoModalForm[K]) => {
      setModalForm((prev) => ({ ...prev, [key]: value }));
      setModalError(null);
      setModalStatus((prev) => (prev === 'success' ? 'selected' : prev));
    },
    []
  );

  const setModalFileType = useCallback((value: NominaFileType) => {
    setModalForm((prev) => ({ ...prev, fileType: value }));
    setModalError(null);
  }, []);

  const handleUploadAndRun = useCallback(async () => {
    const parsedVersionId = Number(modalForm.versionId);

    if (!Number.isFinite(parsedVersionId) || parsedVersionId <= 0) {
      setModalError('Captura un versionId valido.');
      return;
    }

    if (!Number.isFinite(userId) || Number(userId) <= 0) {
      setModalError('No se encontro un usuario autenticado para registrar la carga.');
      return;
    }

    if (!(modalForm.file instanceof File)) {
      setModalError('Selecciona un archivo DBF valido.');
      return;
    }

    try {
      setModalStatus('uploading');
      setModalError(null);

      const archivo = await catalogo.uploadArchivo({
        versionId: parsedVersionId,
        fileType: modalForm.fileType,
        createdByUserId: userId,
        file: modalForm.file,
      });

      setModalStatus('running');

      if (activeEntity === 'catalogo') {
        await catalogo.runCatalogo(archivo.fileId);
        toast.success('Catalogo cargado y ejecutado correctamente.');
      } else {
        await nomina.runStaging(archivo.fileId);
        toast.success('Archivo de nomina cargado y ejecutado correctamente.');
      }

      setModalStatus('success');
    } catch {
      setModalStatus('error');
      setModalError('No se pudo completar la carga automatica del archivo.');

      if (activeEntity === 'catalogo') {
        toast.error('Fallo la carga automatica del catalogo.');
      } else {
        toast.error('Fallo la carga automatica del archivo de nomina.');
      }
    }
  }, [activeEntity, catalogo, modalForm, nomina, userId]);

  return {
    isUploadModalOpen,
    modalForm,
    modalStatus,
    modalError,
    openUploadModal,
    closeUploadModal,
    updateModalField,
    setModalFileType,
    handleUploadAndRun,
  };
}
