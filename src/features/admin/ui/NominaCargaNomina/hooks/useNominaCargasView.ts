'use client';

import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import type {
  CatalogoModalForm,
  NominaCargaEntity,
  NominaCargaModalStatus,
} from '../types/nomina-cargas.types';
import { useNominaStaging } from '@/features/admin/hooks/useNominaStaging';
import { useNominaCatalogo } from '@/features/admin/hooks/useNominaCatalogo';
import { NominaFileType } from '@/features/admin/types/nomina-catalogo.types';
import { useAuth } from '@/features/auth/context/auth.context';

const INITIAL_MODAL_FORM: CatalogoModalForm = {
  versionId: '',
  fileType: 'CATALOGO',
  file: null,
};

export function useNominaCargasView() {
  const { sesion } = useAuth();

  const catalogo = useNominaCatalogo();
  const nomina = useNominaStaging();

  const [activeEntity, setActiveEntity] =
    useState<NominaCargaEntity>('catalogo');
  const [searchFileId, setSearchFileId] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [consultMessage, setConsultMessage] = useState<string | null>(null);

  const [modalForm, setModalForm] =
    useState<CatalogoModalForm>(INITIAL_MODAL_FORM);
  const [modalStatus, setModalStatus] =
    useState<NominaCargaModalStatus>('idle');
  const [modalError, setModalError] = useState<string | null>(null);

  const activeError = useMemo(() => {
    if (activeEntity === 'catalogo') {
      return catalogo.errorUpload ?? catalogo.errorRun ?? null;
    }

    return nomina.errorRun ?? null;
  }, [
    activeEntity,
    catalogo.errorRun,
    catalogo.errorUpload,
    nomina.errorRun,
  ]);

  const currentLoading = useMemo(() => {
    if (activeEntity === 'catalogo') {
      return catalogo.loadingUpload || catalogo.loadingRun;
    }

    return nomina.loadingRun;
  }, [
    activeEntity,
    catalogo.loadingRun,
    catalogo.loadingUpload,
    nomina.loadingRun,
  ]);

  const canSearch = useMemo(() => {
    return Number(searchFileId) > 0 && !currentLoading;
  }, [currentLoading, searchFileId]);

  const canExecute = useMemo(() => {
    return Number(searchFileId) > 0 && !currentLoading;
  }, [currentLoading, searchFileId]);

  const handleSelectEntity = useCallback((entity: NominaCargaEntity) => {
    setActiveEntity(entity);
    setSearchFileId('');
    setConsultMessage(null);
  }, []);

  const handleConsult = useCallback(async () => {
    const parsedFileId = Number(searchFileId);

    if (!Number.isFinite(parsedFileId) || parsedFileId <= 0) {
      toast.warning('Captura un fileId válido.');
      return;
    }

    setConsultMessage(
      `La búsqueda por fileId (${parsedFileId}) ya quedó preparada en la UI. Solo falta conectar el endpoint real de consulta.`
    );

    toast.message('Consulta preparada visualmente.', {
      description:
        'Falta enlazar el endpoint real para recuperar el detalle por fileId.',
    });
  }, [searchFileId]);

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
    const isBusy =
      catalogo.loadingUpload ||
      catalogo.loadingRun ||
      nomina.loadingRun;

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
    const createdByUserId = sesion?.userId;

    if (!Number.isFinite(parsedVersionId) || parsedVersionId <= 0) {
      setModalError('Captura un versionId válido.');
      return;
    }

    if (!Number.isFinite(createdByUserId) || Number(createdByUserId) <= 0) {
      setModalError(
        'No se encontró un usuario autenticado para registrar la carga.'
      );
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
        createdByUserId,
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
  }, [activeEntity, catalogo, nomina, modalForm, sesion?.userId]);

  const shouldDimContent = useMemo(() => {
    if (activeEntity === 'catalogo') {
      return !catalogo.archivo && !catalogo.ejecucion;
    }

    return !nomina.ejecucion;
  }, [activeEntity, catalogo.archivo, catalogo.ejecucion, nomina.ejecucion]);

  return {
    activeEntity,
    searchFileId,
    isUploadModalOpen,
    consultMessage,
    activeError,
    currentLoading,
    canSearch,
    canExecute,
    shouldDimContent,

    catalogo,
    nomina,

    modalForm,
    modalStatus,
    modalError,

    handleSelectEntity,
    setSearchFileId,
    handleConsult,
    handleExecute,

    openUploadModal,
    closeUploadModal,
    updateModalField,
    setModalFileType,
    handleUploadAndRun,
  };
}