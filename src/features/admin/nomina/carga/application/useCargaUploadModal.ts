'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { useAdminBackgroundTask } from '@/features/admin/shared/context/admin-background-task.context';
import { isApiError, toErrorMessage } from '@/lib/api/api.errors';
import type { NominaFileType } from '@/features/admin/nomina/shared/model/catalogo.types';
import type { useCatalogoResource } from './useCatalogoResource';
import type { useNominaFilesResource } from './useNominaFilesResource';
import type { useCargaVersionesResource } from './useCargaVersionesResource';
import type { useStagingResource } from './useStagingResource';
import {
  formatNominaTitle,
  inferNominaFileTypeFromName,
} from '../model/carga.selectors';
import type {
  CatalogoModalForm,
  NominaCargaBackgroundTask,
  NominaCargaEntity,
  NominaCargaModalStatus,
} from '../model/carga.types';

type CatalogoState = ReturnType<typeof useCatalogoResource>;
type FilesState = ReturnType<typeof useNominaFilesResource>;
type NominaState = ReturnType<typeof useStagingResource>;
type VersionesState = ReturnType<typeof useCargaVersionesResource>;
type SubmitIntent = 'upload' | 'uploadAndRun' | null;

const INITIAL_MODAL_FORM: CatalogoModalForm = {
  versionId: '',
  fileType: 'CATALOGO',
  files: [],
};

type Params = {
  activeEntity: NominaCargaEntity;
  catalogo: CatalogoState;
  files: FilesState;
  nomina: NominaState;
  versiones: VersionesState;
  userId?: number | null;
};

function buildCargaConflictMessage(activeEntity: NominaCargaEntity) {
  if (activeEntity === 'catalogo') {
    return {
      inline: 'La versión seleccionada ya cuenta con un catálogo cargado.',
      bubbleTitle: 'Catálogo ya registrado',
      bubbleDetail:
        'Ya existe un catálogo para esta versión. Elige otra versión o usa el archivo ya cargado.',
      toast: 'Esta versión ya tiene un catálogo cargado.',
    };
  }

  return {
    inline: 'Uno de los archivos ya existe para la versión seleccionada.',
    bubbleTitle: 'Archivo ya registrado',
    bubbleDetail:
      'La cola se detuvo porque uno de los archivos ya había sido cargado previamente.',
    toast: 'Uno de los archivos de nómina ya fue cargado para esta versión.',
  };
}

function buildNominaQueue(files: File[]) {
  const queue: Array<{ file: File; fileType: NominaFileType }> = [];
  const unknown: string[] = [];

  for (const file of files) {
    const inferred = inferNominaFileTypeFromName(file.name);
    if (!inferred || inferred === 'CATALOGO') {
      unknown.push(file.name);
      continue;
    }

    queue.push({ file, fileType: inferred as NominaFileType });
  }

  return { queue, unknown };
}

export function useCargaUploadModal({
  activeEntity,
  catalogo,
  files,
  nomina,
  versiones,
  userId,
}: Params) {
  const isCatalogo = activeEntity === 'catalogo';
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [modalForm, setModalForm] = useState<CatalogoModalForm>(INITIAL_MODAL_FORM);
  const [modalStatus, setModalStatus] = useState<NominaCargaModalStatus>('idle');
  const [modalError, setModalError] = useState<string | null>(null);
  const [submitIntent, setSubmitIntent] = useState<SubmitIntent>(null);
  const { setBackgroundTask } = useAdminBackgroundTask();
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dismissTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopProgressLoop = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const stopDismissTimeout = useCallback(() => {
    if (dismissTimeoutRef.current) {
      clearTimeout(dismissTimeoutRef.current);
      dismissTimeoutRef.current = null;
    }
  }, []);

  const scheduleBubbleDismiss = useCallback(
    (delay = 2600) => {
      stopDismissTimeout();
      dismissTimeoutRef.current = setTimeout(() => {
        setBackgroundTask({
          visible: false,
          title: '',
          detail: '',
          progress: 0,
          status: 'idle',
        });
      }, delay);
    },
    [setBackgroundTask, stopDismissTimeout]
  );

  const startBackgroundTask = useCallback(
    (
      title: string,
      detail: string,
      meta?: Pick<
        NominaCargaBackgroundTask,
        'currentIndex' | 'totalItems' | 'currentItemLabel'
      >
    ) => {
      stopProgressLoop();
      stopDismissTimeout();

      setBackgroundTask({
        visible: true,
        title,
        detail,
        progress: 8,
        status: 'uploading',
        ...meta,
      });

      progressIntervalRef.current = setInterval(() => {
        setBackgroundTask((current) => {
          if (!current.visible || current.status === 'success' || current.status === 'error') {
            return current;
          }

          const max = current.status === 'uploading' ? 48 : 92;
          const step = current.status === 'uploading' ? 7 : 4;

          return {
            ...current,
            progress: Math.min(current.progress + step, max),
          };
        });
      }, 280);
    },
    [setBackgroundTask, stopDismissTimeout, stopProgressLoop]
  );

  const updateBackgroundTask = useCallback(
    (patch: Partial<NominaCargaBackgroundTask>) => {
      setBackgroundTask((current) => ({
        ...current,
        ...patch,
        visible: true,
      }));
    },
    [setBackgroundTask]
  );

  const resetModal = useCallback(() => {
    setModalStatus('idle');
    setModalError(null);
    setSubmitIntent(null);
  }, []);

  const openUploadModal = useCallback(() => {
    setModalForm({
      versionId: '',
      fileType: activeEntity === 'catalogo' ? 'CATALOGO' : 'TCOMP',
      files: [],
    });
    resetModal();
    setIsUploadModalOpen(true);

    if (versiones.lista.length === 0 && !versiones.loadingLista) {
      void versiones.cargarLista();
    }
  }, [activeEntity, resetModal, versiones]);

  const closeUploadModal = useCallback(() => {
    const isBusy = catalogo.loadingUpload || catalogo.loadingRun || nomina.loadingRun;
    if (isBusy) return;

    setIsUploadModalOpen(false);
    resetModal();
  }, [catalogo.loadingRun, catalogo.loadingUpload, nomina.loadingRun, resetModal]);

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

  const runUploadFlow = useCallback(
    async (executeAfterUpload: boolean) => {
      const parsedVersionId = Number(modalForm.versionId);
      const normalizedUserId =
        typeof userId === 'number' && Number.isFinite(userId) && userId > 0
          ? userId
          : undefined;

      if (!Number.isFinite(parsedVersionId) || parsedVersionId <= 0) {
        setModalError('Selecciona una versión válida.');
        return;
      }

      if (normalizedUserId === undefined) {
        setModalError('No se encontró un usuario autenticado para registrar la carga.');
        return;
      }

      if (modalForm.files.length === 0) {
        setModalError(
          isCatalogo
            ? 'Selecciona un archivo DBF válido.'
            : 'Selecciona al menos un archivo DBF válido.'
        );
        return;
      }

      const nominaQueueState = isCatalogo ? null : buildNominaQueue(modalForm.files);
      const queue = isCatalogo
        ? [{ file: modalForm.files[0], fileType: modalForm.fileType }]
        : (nominaQueueState?.queue ?? []);
      const unknownFiles = isCatalogo ? [] : (nominaQueueState?.unknown ?? []);

      if (unknownFiles.length > 0) {
        setModalError(
          `No se pudo identificar el tipo de: ${unknownFiles.join(', ')}. Renombra esos archivos antes de continuar.`
        );
        return;
      }

      if (queue.length === 0) {
        setModalError('No se encontraron archivos válidos para iniciar el proceso.');
        return;
      }

      try {
        setSubmitIntent(executeAfterUpload ? 'uploadAndRun' : 'upload');
        setModalStatus('uploading');
        setModalError(null);

        if (executeAfterUpload) {
          setIsUploadModalOpen(false);
        }

        const totalItems = queue.length;

        for (const [index, item] of queue.entries()) {
          const currentIndex = index + 1;
          const currentItemLabel = formatNominaTitle(item.fileType);

          if (executeAfterUpload) {
            startBackgroundTask(
              isCatalogo ? 'Cargando catálogo' : 'Cargando archivos de nómina',
              isCatalogo
                ? 'Subiendo archivo DBF...'
                : `Subiendo ${currentItemLabel} (${currentIndex}/${totalItems})...`,
              {
                currentIndex,
                totalItems,
                currentItemLabel,
              }
            );
          }

          const archivo = await catalogo.uploadArchivo({
            versionId: parsedVersionId,
            fileType: item.fileType,
            createdByUserId: normalizedUserId,
            file: item.file,
          });

          if (executeAfterUpload) {
            setModalStatus('running');
            updateBackgroundTask({
              status: 'running',
              currentIndex,
              totalItems,
              currentItemLabel,
              detail: isCatalogo
                ? 'Ejecutando catálogo en segundo plano...'
                : `Ejecutando ${currentItemLabel} (${currentIndex}/${totalItems})...`,
            });

            if (isCatalogo) {
              await catalogo.runCatalogo(archivo.fileId);
            } else {
              await nomina.runStaging(archivo.fileId);
            }
          }
        }

        await files.cargarLista();

        if (executeAfterUpload) {
          stopProgressLoop();
          updateBackgroundTask({
            status: 'success',
            progress: 100,
            title: 'Carga exitosa',
            detail: isCatalogo
              ? 'El catálogo ya se procesó y la lista fue actualizada.'
              : `La cola de ${queue.length} archivo${queue.length === 1 ? '' : 's'} terminó correctamente.`,
            currentIndex: queue.length,
            totalItems: queue.length,
          });
          scheduleBubbleDismiss();
        } else {
          setIsUploadModalOpen(false);
        }

        if (executeAfterUpload) {
          if (isCatalogo) {
            toast.success('Catálogo cargado y ejecutado correctamente.');
          } else {
            toast.success(`Se procesó la cola completa de ${queue.length} archivos.`);
          }
        } else if (isCatalogo) {
          toast.success('Catálogo cargado correctamente.');
        } else {
          toast.success(`Se cargaron ${queue.length} archivos correctamente.`);
        }

        setModalStatus('success');
        setModalForm(INITIAL_MODAL_FORM);
        setSubmitIntent(null);
      } catch (error) {
        stopProgressLoop();
        setModalStatus('error');
        setSubmitIntent(null);

        const isConflict = isApiError(error) && error.status === 409;
        const conflictMessage = buildCargaConflictMessage(activeEntity);
        const fallbackMessage = executeAfterUpload
          ? activeEntity === 'catalogo'
            ? 'No se pudo completar la carga automática del catálogo.'
            : 'No se pudo completar la cola automática de archivos de nómina.'
          : activeEntity === 'catalogo'
            ? 'No se pudo completar la carga del catálogo.'
            : 'No se pudo completar la carga de los archivos de nómina.';
        const finalMessage = isConflict
          ? conflictMessage.inline
          : toErrorMessage(error, fallbackMessage);

        setModalError(finalMessage);

        if (executeAfterUpload) {
          updateBackgroundTask(
            isConflict
              ? {
                  status: 'error',
                  progress: 100,
                  title: conflictMessage.bubbleTitle,
                  detail: conflictMessage.bubbleDetail,
                }
              : {
                  status: 'error',
                  progress: 100,
                  title: 'No se pudo completar la carga',
                  detail: finalMessage,
                }
          );
          scheduleBubbleDismiss(4200);
        }

        if (isConflict) {
          toast.error(conflictMessage.toast);
        } else if (executeAfterUpload) {
          toast.error(
            activeEntity === 'catalogo'
              ? 'Falló la carga automática del catálogo.'
              : 'Falló la cola automática de archivos de nómina.'
          );
        } else {
          toast.error(
            activeEntity === 'catalogo'
              ? 'Falló la carga del catálogo.'
              : 'Falló la carga de los archivos de nómina.'
          );
        }
      }
    },
    [
      activeEntity,
      catalogo,
      files,
      isCatalogo,
      modalForm.fileType,
      modalForm.files,
      modalForm.versionId,
      nomina,
      scheduleBubbleDismiss,
      startBackgroundTask,
      stopProgressLoop,
      updateBackgroundTask,
      userId,
    ]
  );

  const handleUploadOnly = useCallback(() => {
    void runUploadFlow(false);
  }, [runUploadFlow]);

  const handleUploadAndRun = useCallback(() => {
    void runUploadFlow(true);
  }, [runUploadFlow]);

  useEffect(() => {
    return () => {
      stopProgressLoop();
      stopDismissTimeout();
    };
  }, [stopDismissTimeout, stopProgressLoop]);

  return {
    isUploadModalOpen,
    modalForm,
    modalStatus,
    modalError,
    submitIntent,
    openUploadModal,
    closeUploadModal,
    updateModalField,
    setModalFileType,
    handleUploadOnly,
    handleUploadAndRun,
  };
}
