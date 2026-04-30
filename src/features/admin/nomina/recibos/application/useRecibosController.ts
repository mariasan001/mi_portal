'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/features/auth/context/auth.context';
import type { VersionNominaDto } from '@/features/admin/nomina/shared/model/versiones.types';
import { useAdminBackgroundTask } from '@/features/admin/shared/context/admin-background-task.context';

import type {
  RecibosAction,
  RecibosFormState,
  RecibosVersionProgress,
} from '../model/recibos.types';
import {
  buildStepItems,
  buildVersionCardItems,
  createInitialProgress,
  getNextAction,
} from '../model/recibos.selectors';
import { useRecibosActions } from './useRecibosActions';
import { useRecibosVersionesResource } from './useRecibosVersionesResource';

function sortVersions(items: VersionNominaDto[]) {
  return [...items].sort((left, right) => right.versionId - left.versionId);
}

function mergeProgress(
  version: Pick<VersionNominaDto, 'released'> | null | undefined,
  stored?: Partial<RecibosVersionProgress>
): RecibosVersionProgress {
  return {
    ...createInitialProgress(version),
    ...(stored ?? {}),
  };
}

export function useRecibosController() {
  const { sesion } = useAuth();
  const { setBackgroundTask } = useAdminBackgroundTask();
  const domain = useRecibosActions();
  const versions = useRecibosVersionesResource();
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dismissTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [form, setForm] = useState<RecibosFormState>({
    comments: '',
  });
  const [selectedVersionId, setSelectedVersionId] = useState('');
  const [preferredAction, setPreferredAction] = useState<RecibosAction>('snapshots');
  const [technicalFlowVersionId, setTechnicalFlowVersionId] = useState<number | null>(null);
  const [progressByVersionId, setProgressByVersionId] = useState<
    Record<number, RecibosVersionProgress>
  >({});

  const orderedVersions = useMemo(() => sortVersions(versions.lista), [versions.lista]);
  const releasedByUserId = sesion?.userId;
  const releaseFormReady = Boolean(
    releasedByUserId && Number.isFinite(releasedByUserId) && releasedByUserId > 0
  );

  const selectedVersion = useMemo(
    () =>
      orderedVersions.find((item) => String(item.versionId) === selectedVersionId) ?? null,
    [orderedVersions, selectedVersionId]
  );

  const selectedProgress = useMemo(() => {
    if (!selectedVersion) {
      return createInitialProgress();
    }

    return mergeProgress(
      selectedVersion,
      progressByVersionId[selectedVersion.versionId]
    );
  }, [progressByVersionId, selectedVersion]);

  const stepItems = useMemo(
    () => buildStepItems({ progress: selectedProgress, releaseFormReady }),
    [releaseFormReady, selectedProgress]
  );

  const defaultAction = getNextAction(selectedProgress);
  const activeAction =
    stepItems.find((item) => item.key === preferredAction && item.status !== 'blocked')?.key ??
    defaultAction;

  const updateField = useCallback((key: keyof RecibosFormState, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }, []);

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
      meta?: {
        currentIndex?: number;
        totalItems?: number;
        currentItemLabel?: string;
      }
    ) => {
      stopProgressLoop();
      stopDismissTimeout();

      setBackgroundTask({
        visible: true,
        title,
        detail,
        progress: 10,
        status: 'running',
        ...meta,
      });

      progressIntervalRef.current = setInterval(() => {
        setBackgroundTask((current) => {
          if (!current.visible || current.status === 'success' || current.status === 'error') {
            return current;
          }

          return {
            ...current,
            progress: Math.min(current.progress + 5, 92),
          };
        });
      }, 280);
    },
    [setBackgroundTask, stopDismissTimeout, stopProgressLoop]
  );

  const updateBackgroundTask = useCallback(
    (patch: {
      visible?: boolean;
      title?: string;
      detail?: string;
      progress?: number;
      status?: 'idle' | 'uploading' | 'running' | 'success' | 'error';
      currentIndex?: number;
      totalItems?: number;
      currentItemLabel?: string;
    }) => {
      setBackgroundTask((current) => ({
        ...current,
        ...patch,
        visible: true,
      }));
    },
    [setBackgroundTask]
  );

  const toggleSelectedVersionId = useCallback((value: string) => {
    setSelectedVersionId((current) => (current === value ? '' : value));
  }, []);

  const setVersionProgress = useCallback(
    (versionId: number, update: Partial<RecibosVersionProgress>) => {
      setProgressByVersionId((current) => {
        const currentProgress =
          mergeProgress(
            orderedVersions.find((item) => item.versionId === versionId) ?? null,
            current[versionId]
          );

        const next = {
          ...current,
          [versionId]: {
            ...currentProgress,
            ...update,
          },
        };

        return next;
      });
    },
    [orderedVersions]
  );

  const executeSnapshots = useCallback(async () => {
    if (!selectedVersion) {
      toast.error('Selecciona una version valida.');
      return;
    }

    if (selectedProgress.snapshotsDone) {
      toast.message('Los snapshots ya fueron generados para esta version.');
      return;
    }

    try {
      const response = await domain.ejecutarSnapshots(selectedVersion.versionId);
      setVersionProgress(selectedVersion.versionId, {
        snapshotsDone: true,
        snapshots: response,
      });
      setPreferredAction('recibos');
      toast.success('Snapshots generados correctamente.');
    } catch {
      toast.error('No se pudieron generar los snapshots.');
    }
  }, [domain, selectedProgress.snapshotsDone, selectedVersion, setVersionProgress]);

  const executeReceipts = useCallback(async () => {
    if (!selectedVersion) {
      toast.error('Selecciona una version valida.');
      return;
    }

    if (!selectedProgress.snapshotsDone) {
      toast.error('Primero debes generar los snapshots.');
      return;
    }

    if (selectedProgress.receiptsDone) {
      toast.message('Los recibos ya fueron generados para esta version.');
      return;
    }

    try {
      const response = await domain.ejecutarRecibos(selectedVersion.versionId);
      setVersionProgress(selectedVersion.versionId, {
        receiptsDone: true,
        receipts: response,
      });
      setPreferredAction('sincronizacion');
      toast.success('Recibos generados correctamente.');
    } catch {
      toast.error('No se pudieron generar los recibos.');
    }
  }, [
    domain,
    selectedProgress.receiptsDone,
    selectedProgress.snapshotsDone,
    selectedVersion,
    setVersionProgress,
  ]);

  const executeCoreSync = useCallback(async () => {
    if (!selectedVersion) {
      toast.error('Selecciona una version valida.');
      return;
    }

    if (!selectedProgress.receiptsDone) {
      toast.error('Primero debes generar los recibos.');
      return;
    }

    if (selectedProgress.coreSyncDone) {
      toast.message('La sincronizacion ya fue ejecutada para esta version.');
      return;
    }

    try {
      const response = await domain.ejecutarCoreSync(selectedVersion.versionId);
      setVersionProgress(selectedVersion.versionId, {
        coreSyncDone: true,
        coreSync: response,
      });
      setPreferredAction('liberacion');
      toast.success('Sincronizacion completada correctamente.');
    } catch {
      toast.error('No se pudo sincronizar la version.');
    }
  }, [
    domain,
    selectedProgress.coreSyncDone,
    selectedProgress.receiptsDone,
    selectedVersion,
    setVersionProgress,
  ]);

  const executeRelease = useCallback(async () => {
    if (!selectedVersion) {
      toast.error('Selecciona una version valida.');
      return;
    }

    if (!selectedProgress.coreSyncDone) {
      toast.error('No puedes liberar sin completar la sincronizacion.');
      return;
    }

    if (!releaseFormReady || !releasedByUserId) {
      toast.error('No se pudo identificar al usuario autenticado.');
      return;
    }

    if (selectedProgress.releaseDone) {
      toast.message('La version ya fue liberada.');
      return;
    }

    try {
      const response = await domain.ejecutarLiberacion(selectedVersion.versionId, {
        releasedByUserId,
        comments: form.comments.trim(),
      });
      setVersionProgress(selectedVersion.versionId, {
        releaseDone: true,
        release: response,
      });
      toast.success('Version liberada correctamente.');
    } catch {
      toast.error('No se pudo liberar la version.');
    }
  }, [
    domain,
    form.comments,
    releaseFormReady,
    releasedByUserId,
    selectedProgress.coreSyncDone,
    selectedProgress.releaseDone,
    selectedVersion,
    setVersionProgress,
  ]);

  const executeTechnicalFlow = useCallback(
    async (versionId: number) => {
      const version = orderedVersions.find((item) => item.versionId === versionId);

      if (!version) {
        toast.error('Selecciona una version valida.');
        return;
      }

      let currentProgress =
        mergeProgress(version, progressByVersionId[versionId]);

      const pipeline = [
        {
          key: 'snapshots' as const,
          label: 'Snapshots',
          isDone: (progress: RecibosVersionProgress) => progress.snapshotsDone,
          run: domain.ejecutarSnapshots,
          apply: (response: Awaited<ReturnType<typeof domain.ejecutarSnapshots>>) => {
            currentProgress = {
              ...currentProgress,
              snapshotsDone: true,
              snapshots: response,
            };
            setVersionProgress(versionId, {
              snapshotsDone: true,
              snapshots: response,
            });
          },
        },
        {
          key: 'recibos' as const,
          label: 'Recibos',
          isDone: (progress: RecibosVersionProgress) => progress.receiptsDone,
          run: domain.ejecutarRecibos,
          apply: (response: Awaited<ReturnType<typeof domain.ejecutarRecibos>>) => {
            currentProgress = {
              ...currentProgress,
              receiptsDone: true,
              receipts: response,
            };
            setVersionProgress(versionId, {
              receiptsDone: true,
              receipts: response,
            });
          },
        },
        {
          key: 'sincronizacion' as const,
          label: 'Sincronizacion',
          isDone: (progress: RecibosVersionProgress) => progress.coreSyncDone,
          run: domain.ejecutarCoreSync,
          apply: (response: Awaited<ReturnType<typeof domain.ejecutarCoreSync>>) => {
            currentProgress = {
              ...currentProgress,
              coreSyncDone: true,
              coreSync: response,
            };
            setVersionProgress(versionId, {
              coreSyncDone: true,
              coreSync: response,
            });
          },
        },
      ];

      const firstPendingIndex = pipeline.findIndex((step) => !step.isDone(currentProgress));
      const pendingSteps =
        firstPendingIndex === -1
          ? []
          : pipeline.slice(firstPendingIndex).filter((step) => !step.isDone(currentProgress));

      if (pendingSteps.length === 0) {
        toast.message('El flujo tecnico ya fue completado para esta version.');
        return;
      }

      setSelectedVersionId(String(versionId));
      setTechnicalFlowVersionId(versionId);

      try {
        for (const [index, step] of pendingSteps.entries()) {
          const currentIndex = index + 1;
          setPreferredAction(step.key);
          startBackgroundTask(
            'Ejecutando flujo tecnico',
            `${step.label} en progreso (${currentIndex}/${pendingSteps.length})...`,
            {
              currentIndex,
              totalItems: pendingSteps.length,
              currentItemLabel: step.label,
            }
          );

          const response = await step.run(versionId);
          step.apply(response);
        }

        setPreferredAction('liberacion');
        stopProgressLoop();
        updateBackgroundTask({
          status: 'success',
          progress: 100,
          title: 'Flujo tecnico completado',
          detail:
            'Snapshots, recibos y sincronizacion terminaron correctamente. Ya puedes liberar la version.',
          currentIndex: pendingSteps.length,
          totalItems: pendingSteps.length,
        });
        scheduleBubbleDismiss();
        toast.success('El flujo tecnico de la version termino correctamente.');
      } catch {
        stopProgressLoop();
        updateBackgroundTask({
          status: 'error',
          progress: 100,
          title: 'El flujo tecnico se detuvo',
          detail: 'Uno de los pasos fallo durante la ejecucion secuencial.',
        });
        scheduleBubbleDismiss(4200);
        toast.error('No se pudo completar el flujo tecnico de la version.');
      } finally {
        setTechnicalFlowVersionId(null);
      }
    },
    [
      domain,
      orderedVersions,
      progressByVersionId,
      scheduleBubbleDismiss,
      setVersionProgress,
      startBackgroundTask,
      stopProgressLoop,
      updateBackgroundTask,
    ]
  );

  const executeStep = useCallback(
    async (action: RecibosAction) => {
      switch (action) {
        case 'snapshots':
          await executeSnapshots();
          break;
        case 'recibos':
          await executeReceipts();
          break;
        case 'sincronizacion':
          await executeCoreSync();
          break;
        case 'liberacion':
          await executeRelease();
          break;
      }
    },
    [executeCoreSync, executeReceipts, executeRelease, executeSnapshots]
  );

  const currentLoading = useMemo(() => {
    switch (activeAction) {
      case 'snapshots':
        return domain.snapshots.loading;
      case 'recibos':
        return domain.receipts.loading;
      case 'sincronizacion':
        return domain.coreSync.loading;
      case 'liberacion':
        return domain.release.loading;
    }
  }, [
    activeAction,
    domain.coreSync.loading,
    domain.receipts.loading,
    domain.release.loading,
    domain.snapshots.loading,
  ]);

  useEffect(() => {
    return () => {
      stopProgressLoop();
      stopDismissTimeout();
    };
  }, [stopDismissTimeout, stopProgressLoop]);

  const versionCards = useMemo(
    () =>
      buildVersionCardItems({
        versions: orderedVersions,
        progressByVersionId: Object.fromEntries(
          orderedVersions.map((version) => [
            version.versionId,
            mergeProgress(version, progressByVersionId[version.versionId]),
          ])
        ),
        releaseFormReady,
      }),
    [orderedVersions, progressByVersionId, releaseFormReady]
  );

  const currentError = versions.errorLista;

  return {
    form,
    updateField,
    activeAction,
    setActiveAction: setPreferredAction,
    selectedVersionId,
    setSelectedVersionId: toggleSelectedVersionId,
    currentLoading,
    technicalFlowLoading: technicalFlowVersionId !== null,
    technicalFlowVersionId: technicalFlowVersionId
      ? String(technicalFlowVersionId)
      : '',
    executeStep,
    executeTechnicalFlow,
    stepItems,
    versionCards,
    currentError,
    loadingVersions: versions.loadingLista,
    results: {
      snapshots: selectedProgress.snapshots,
      receipts: selectedProgress.receipts,
      release: selectedProgress.release,
      coreSync: selectedProgress.coreSync,
    },
  };
}
