'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';

import type { ArchivoNominaDto } from '@/features/admin/nomina/shared/model/catalogo.types';
import { useAdminBackgroundTask } from '@/features/admin/shared/context/admin-background-task.context';
import { formatNominaTitle } from '../model/carga.selectors';
import type {
  NominaCargaBackgroundTask,
  NominaCargaEntity,
} from '../model/carga.types';
import type { useCatalogoResource } from './useCatalogoResource';
import type { useNominaFilesResource } from './useNominaFilesResource';
import type { useStagingResource } from './useStagingResource';

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
  const { backgroundTask, setBackgroundTask } = useAdminBackgroundTask();
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
    (patch: Partial<NominaCargaBackgroundTask>) => {
      setBackgroundTask((current) => ({
        ...current,
        ...patch,
        visible: true,
      }));
    },
    [setBackgroundTask]
  );

  const activeError = useMemo(() => files.errorLista ?? null, [files.errorLista]);

  const currentLoading = useMemo(() => {
    if (activeEntity === 'catalogo') {
      return catalogo.loadingUpload || catalogo.loadingRun || files.loadingLista;
    }

    return nomina.loadingRun || files.loadingLista;
  }, [
    activeEntity,
    catalogo.loadingRun,
    catalogo.loadingUpload,
    files.loadingLista,
    nomina.loadingRun,
  ]);

  const handleExecuteFile = useCallback(
    async (fileId: number, fileType?: string) => {
      try {
        if (activeEntity === 'catalogo') {
          startBackgroundTask(
            'Ejecutando catálogo',
            'Procesando el archivo en segundo plano...'
          );
          await catalogo.runCatalogo(fileId);
          await files.cargarLista();
          stopProgressLoop();
          updateBackgroundTask({
            status: 'success',
            progress: 100,
            title: 'Ejecución completada',
            detail: 'La carga de catálogo terminó correctamente.',
          });
          scheduleBubbleDismiss();
          toast.success('Carga de catálogo ejecutada correctamente.');
          return;
        }

        const itemLabel = fileType ? formatNominaTitle(fileType) : 'Archivo';
        startBackgroundTask(
          'Ejecutando nómina',
          `Procesando ${itemLabel} en segundo plano...`,
          {
            currentIndex: 1,
            totalItems: 1,
            currentItemLabel: itemLabel,
          }
        );
        await nomina.runStaging(fileId);
        await files.cargarLista();
        stopProgressLoop();
        updateBackgroundTask({
          status: 'success',
          progress: 100,
          title: 'Ejecución completada',
          detail: `${itemLabel} terminó correctamente.`,
          currentIndex: 1,
          totalItems: 1,
          currentItemLabel: itemLabel,
        });
        scheduleBubbleDismiss();
        toast.success('Staging de nómina ejecutado correctamente.');
      } catch {
        stopProgressLoop();
        updateBackgroundTask({
          status: 'error',
          progress: 100,
          title: 'No se pudo ejecutar',
          detail:
            activeEntity === 'catalogo'
              ? 'La carga de catálogo terminó con error.'
              : 'La ejecución del archivo de nómina terminó con error.',
        });
        scheduleBubbleDismiss(4200);

        if (activeEntity === 'catalogo') {
          toast.error('No se pudo ejecutar la carga de catálogo.');
          return;
        }

        toast.error('No se pudo ejecutar el staging de nómina.');
      }
    },
    [
      activeEntity,
      catalogo,
      files,
      nomina,
      scheduleBubbleDismiss,
      startBackgroundTask,
      stopProgressLoop,
      updateBackgroundTask,
    ]
  );

  const handleExecuteGroup = useCallback(
    async (items: ArchivoNominaDto[]) => {
      if (activeEntity !== 'nomina' || items.length === 0) return;

      const pendingItems = items.filter(
        (item) => !['PROCESSED', 'PROCESSING'].includes((item.status ?? '').toUpperCase())
      );

      if (pendingItems.length === 0) {
        toast.info('No hay archivos pendientes por ejecutar en esta versión.');
        return;
      }

      const totalItems = pendingItems.length;

      try {
        for (const [index, item] of pendingItems.entries()) {
          const currentIndex = index + 1;
          const currentItemLabel = formatNominaTitle(item.fileType);

          startBackgroundTask(
            'Ejecutando cola de nómina',
            `Procesando ${currentItemLabel} (${currentIndex}/${totalItems})...`,
            {
              currentIndex,
              totalItems,
              currentItemLabel,
            }
          );

          await nomina.runStaging(item.fileId);
        }

        await files.cargarLista();
        stopProgressLoop();
        updateBackgroundTask({
          status: 'success',
          progress: 100,
          title: 'Cola completada',
          detail: `${totalItems} archivo${totalItems === 1 ? '' : 's'} ejecutado${totalItems === 1 ? '' : 's'} correctamente.`,
          currentIndex: totalItems,
          totalItems,
        });
        scheduleBubbleDismiss();
        toast.success('Se ejecutaron todos los archivos pendientes de la versión.');
      } catch {
        stopProgressLoop();
        updateBackgroundTask({
          status: 'error',
          progress: 100,
          title: 'La cola se detuvo',
          detail: 'Uno de los archivos falló durante la ejecución.',
        });
        scheduleBubbleDismiss(4200);
        toast.error('No se pudo completar la ejecución de todos los archivos pendientes.');
      }
    },
    [
      activeEntity,
      files,
      nomina,
      scheduleBubbleDismiss,
      startBackgroundTask,
      stopProgressLoop,
      updateBackgroundTask,
    ]
  );

  useEffect(() => {
    return () => {
      stopProgressLoop();
      stopDismissTimeout();
    };
  }, [stopDismissTimeout, stopProgressLoop]);

  return {
    activeError,
    backgroundTask,
    currentLoading,
    handleExecuteFile,
    handleExecuteGroup,
  };
}
