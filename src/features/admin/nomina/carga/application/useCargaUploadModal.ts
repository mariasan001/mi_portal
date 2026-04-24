'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import type { NominaFileType } from '@/features/admin/nomina/shared/model/catalogo.types';
import type { useCatalogoResource } from './useCatalogoResource';
import type { useStagingResource } from './useStagingResource';
import type {
  CatalogoModalForm,
  NominaCargaEntity,
  NominaCargaModalStatus,
} from '../model/carga.types';

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

export function useCargaUploadModal({
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
    const normalizedUserId =
      typeof userId === 'number' && Number.isFinite(userId) && userId > 0
        ? userId
        : undefined;

    if (!Number.isFinite(parsedVersionId) || parsedVersionId <= 0) {
      setModalError('Captura un versionId válido.');
      return;
    }

    if (normalizedUserId === undefined) {
      setModalError('No se encontró un usuario autenticado para registrar la carga.');
      return;
    }

    if (!(modalForm.file instanceof File)) {
      setModalError('Selecciona un archivo DBF válido.');
      return;
    }

    try {
      setModalStatus('uploading');
      setModalError(null);

      const archivo = await catalogo.uploadArchivo({
        versionId: parsedVersionId,
        fileType: modalForm.fileType,
        createdByUserId: normalizedUserId,
        file: modalForm.file,
      });

      setModalStatus('running');

      if (activeEntity === 'catalogo') {
        await catalogo.runCatalogo(archivo.fileId);
        toast.success('Catálogo cargado y ejecutado correctamente.');
      } else {
        await nomina.runStaging(archivo.fileId);
        toast.success('Archivo de nómina cargado y ejecutado correctamente.');
      }

      setModalStatus('success');
    } catch {
      setModalStatus('error');
      setModalError('No se pudo completar la carga automática del archivo.');

      if (activeEntity === 'catalogo') {
        toast.error('Falló la carga automática del catálogo.');
      } else {
        toast.error('Falló la carga automática del archivo de nómina.');
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
