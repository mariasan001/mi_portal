'use client';

import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useNominaRecibos } from '../../../hooks/useNominaRecibos';
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
  const canRunCoreSync = Boolean(versionIdParsed && receiptsDone);
  const canRunRelease = Boolean(versionIdParsed && releasedByUserIdParsed);

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

  const runCoreSync = useCallback(async (): Promise<void> => {
    if (!versionIdParsed) {
      toast.error('Debes capturar un Version ID válido.');
      return;
    }

    if (!receiptsDone) {
      toast.error('Primero debes generar los recibos.');
      return;
    }

    try {
      await domain.ejecutarCoreSync(versionIdParsed);
      toast.success('Sincronización a core completada.');
    } catch {
      toast.error('No se pudo sincronizar a core.');
    }
  }, [domain, receiptsDone, versionIdParsed]);

  const runRelease = useCallback(async (): Promise<void> => {
    if (!versionIdParsed) {
      toast.error('Debes capturar un Version ID válido.');
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
  }, [domain, form.comments, releasedByUserIdParsed, versionIdParsed]);

  const executeActiveAction = useCallback(async (): Promise<void> => {
    switch (activeAction) {
      case 'snapshots':
        await runSnapshots();
        break;
      case 'recibos':
        await runReceipts();
        break;
      case 'sincronizacion':
        await runCoreSync();
        break;
    }
  }, [activeAction, runSnapshots, runReceipts, runCoreSync]);

  const currentLoading = useMemo(() => {
    switch (activeAction) {
      case 'snapshots':
        return domain.snapshots.loading;
      case 'recibos':
        return domain.receipts.loading;
      case 'sincronizacion':
        return domain.coreSync.loading;
    }
  }, [
    activeAction,
    domain.snapshots.loading,
    domain.receipts.loading,
    domain.coreSync.loading,
  ]);

  const currentTitle = useMemo(() => {
    switch (activeAction) {
      case 'snapshots':
        return 'Generación de snapshots';
      case 'recibos':
        return 'Generación de recibos';
      case 'sincronizacion':
        return 'Sincronización a core';
    }
  }, [activeAction]);

  const currentDescription = useMemo(() => {
    switch (activeAction) {
      case 'snapshots':
        return 'Construye snapshots consolidados desde staging para la versión seleccionada.';
      case 'recibos':
        return 'Genera recibos y su detalle asociado a partir de snapshots previos.';
      case 'sincronizacion':
        return 'Ejecuta la sincronización complementaria a core para la versión activa.';
    }
  }, [activeAction]);

  const canExecute = useMemo(() => {
    switch (activeAction) {
      case 'snapshots':
        return canRunSnapshots;
      case 'recibos':
        return canRunReceipts;
      case 'sincronizacion':
        return canRunCoreSync;
    }
  }, [activeAction, canRunSnapshots, canRunReceipts, canRunCoreSync]);

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
    currentLoading,

    canExecute,
    executeActiveAction,

    releaseLoading: domain.release.loading,
    canRelease: canRunRelease,
    executeRelease: runRelease,

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