'use client';

import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useNominaRecibos } from '../../../hook/useNominaRecibos';
import {
  buildSummary,
  getGeneralFlowStatus,
  parsePositiveInt,
} from '../utils/nomina-recibos-view.utils';
import type {
  NominaRecibosAction,
  NominaRecibosFormState,
} from '../types/nomina-recibos-view.types';

export function useNominaRecibosView() {
  const domain = useNominaRecibos();

  const [form, setForm] = useState<NominaRecibosFormState>({
    versionId: '',
    releasedByUserId: '',
    comments: '',
  });

  const [activeAction, setActiveAction] =
    useState<NominaRecibosAction>('snapshots');

  const versionIdParsed = useMemo(
    () => parsePositiveInt(form.versionId),
    [form.versionId]
  );

  const releasedByUserIdParsed = useMemo(
    () => parsePositiveInt(form.releasedByUserId),
    [form.releasedByUserId]
  );

  const snapshotsDone = Boolean(domain.snapshots.data);
  const receiptsDone = Boolean(domain.receipts.data);
  const releaseDone = Boolean(domain.release.data);
  const coreSyncDone = Boolean(domain.coreSync.data);

  const canRunSnapshots = Boolean(versionIdParsed);
  const canRunReceipts = Boolean(versionIdParsed && snapshotsDone);
  const canRunRelease = Boolean(
    versionIdParsed && receiptsDone && releasedByUserIdParsed
  );
  const canRunCoreSync = Boolean(versionIdParsed);

  const updateField = useCallback(
    (key: keyof NominaRecibosFormState, value: string): void => {
      setForm((current) => ({
        ...current,
        [key]: value,
      }));
    },
    []
  );

  const runSnapshots = useCallback(async (): Promise<void> => {
    if (!versionIdParsed) {
      toast.error('Debes capturar un Version ID válido.');
      return;
    }

    try {
      await domain.ejecutarSnapshots(versionIdParsed);
      toast.success('Snapshots generados correctamente.');
    } catch {
      toast.error('No se pudieron generar los snapshots.');
    }
  }, [domain, versionIdParsed]);

  const runReceipts = useCallback(async (): Promise<void> => {
    if (!versionIdParsed) {
      toast.error('Debes capturar un Version ID válido.');
      return;
    }

    if (!snapshotsDone) {
      toast.error('Primero debes generar los snapshots.');
      return;
    }

    try {
      await domain.ejecutarRecibos(versionIdParsed);
      toast.success('Recibos generados correctamente.');
    } catch {
      toast.error('No se pudieron generar los recibos.');
    }
  }, [domain, snapshotsDone, versionIdParsed]);

  const runRelease = useCallback(async (): Promise<void> => {
    if (!versionIdParsed) {
      toast.error('Debes capturar un Version ID válido.');
      return;
    }

    if (!receiptsDone) {
      toast.error('Primero debes generar los recibos.');
      return;
    }

    if (!releasedByUserIdParsed) {
      toast.error('Debes capturar un Released By User ID válido.');
      return;
    }

    try {
      await domain.ejecutarLiberacion(versionIdParsed, {
        releasedByUserId: releasedByUserIdParsed,
        comments: form.comments.trim(),
      });
      toast.success('Versión liberada correctamente.');
    } catch {
      toast.error('No se pudo liberar la versión.');
    }
  }, [domain, form.comments, receiptsDone, releasedByUserIdParsed, versionIdParsed]);

  const runCoreSync = useCallback(async (): Promise<void> => {
    if (!versionIdParsed) {
      toast.error('Debes capturar un Version ID válido.');
      return;
    }

    try {
      await domain.ejecutarCoreSync(versionIdParsed);
      toast.success('Sincronización a core completada.');
    } catch {
      toast.error('No se pudo sincronizar a core.');
    }
  }, [domain, versionIdParsed]);

  const executeActiveAction = useCallback(async (): Promise<void> => {
    switch (activeAction) {
      case 'snapshots':
        await runSnapshots();
        break;
      case 'recibos':
        await runReceipts();
        break;
      case 'liberacion':
        await runRelease();
        break;
      case 'sincronizacion':
        await runCoreSync();
        break;
    }
  }, [activeAction, runSnapshots, runReceipts, runRelease, runCoreSync]);

  const currentResult = useMemo(() => {
    switch (activeAction) {
      case 'snapshots':
        return domain.snapshots.data;
      case 'recibos':
        return domain.receipts.data;
      case 'liberacion':
        return domain.release.data;
      case 'sincronizacion':
        return domain.coreSync.data;
      default:
        return null;
    }
  }, [
    activeAction,
    domain.snapshots.data,
    domain.receipts.data,
    domain.release.data,
    domain.coreSync.data,
  ]);

  const currentLoading = useMemo(() => {
    switch (activeAction) {
      case 'snapshots':
        return domain.snapshots.loading;
      case 'recibos':
        return domain.receipts.loading;
      case 'liberacion':
        return domain.release.loading;
      case 'sincronizacion':
        return domain.coreSync.loading;
      default:
        return false;
    }
  }, [
    activeAction,
    domain.snapshots.loading,
    domain.receipts.loading,
    domain.release.loading,
    domain.coreSync.loading,
  ]);

  const currentError = useMemo(() => {
    switch (activeAction) {
      case 'snapshots':
        return domain.snapshots.error;
      case 'recibos':
        return domain.receipts.error;
      case 'liberacion':
        return domain.release.error;
      case 'sincronizacion':
        return domain.coreSync.error;
      default:
        return null;
    }
  }, [
    activeAction,
    domain.snapshots.error,
    domain.receipts.error,
    domain.release.error,
    domain.coreSync.error,
  ]);

  const currentTitle = useMemo(() => {
    switch (activeAction) {
      case 'snapshots':
        return 'Generación de snapshots';
      case 'recibos':
        return 'Generación de recibos';
      case 'liberacion':
        return 'Liberación de versión';
      case 'sincronizacion':
        return 'Sincronización a core';
      default:
        return 'Operación';
    }
  }, [activeAction]);

  const currentDescription = useMemo(() => {
    switch (activeAction) {
      case 'snapshots':
        return 'Construye snapshots consolidados desde staging para la versión seleccionada.';
      case 'recibos':
        return 'Genera recibos y su detalle asociado a partir de snapshots previos.';
      case 'liberacion':
        return 'Libera la versión procesada usando el usuario responsable y comentarios operativos.';
      case 'sincronizacion':
        return 'Ejecuta la sincronización complementaria a core para la versión activa.';
      default:
        return '';
    }
  }, [activeAction]);

  const canExecute = useMemo(() => {
    switch (activeAction) {
      case 'snapshots':
        return canRunSnapshots;
      case 'recibos':
        return canRunReceipts;
      case 'liberacion':
        return canRunRelease;
      case 'sincronizacion':
        return canRunCoreSync;
      default:
        return false;
    }
  }, [
    activeAction,
    canRunSnapshots,
    canRunReceipts,
    canRunRelease,
    canRunCoreSync,
  ]);

  const summaryItems = useMemo(
    () =>
      buildSummary({
        versionId: versionIdParsed,
        releasedByUserId: releasedByUserIdParsed,
        snapshotsDone,
        receiptsDone,
        releaseDone,
        coreSyncDone,
      }),
    [
      versionIdParsed,
      releasedByUserIdParsed,
      snapshotsDone,
      receiptsDone,
      releaseDone,
      coreSyncDone,
    ]
  );

  const generalStatus = useMemo(
    () =>
      getGeneralFlowStatus({
        snapshotsDone,
        receiptsDone,
        releaseDone,
        coreSyncDone,
      }),
    [snapshotsDone, receiptsDone, releaseDone, coreSyncDone]
  );

  const hasAnyResult = Boolean(
    domain.snapshots.data ||
      domain.receipts.data ||
      domain.release.data ||
      domain.coreSync.data
  );

  return {
    form,
    updateField,

    activeAction,
    setActiveAction,

    versionIdParsed,
    releasedByUserIdParsed,

    currentTitle,
    currentDescription,
    currentResult,
    currentLoading,
    currentError,

    canExecute,
    executeActiveAction,

    summaryItems,
    generalStatus,
    hasAnyResult,

    results: {
      snapshots: domain.snapshots.data,
      receipts: domain.receipts.data,
      release: domain.release.data,
      coreSync: domain.coreSync.data,
    },
  };
}