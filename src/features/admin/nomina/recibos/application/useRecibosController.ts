'use client';

import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import type { RecibosAction, RecibosFormState } from '../model/recibos.types';
import {
  buildSummary,
  getGeneralFlowStatus,
  parsePositiveInt,
} from '../model/recibos.selectors';
import { useRecibosActions } from './useRecibosActions';

export function useRecibosController() {
  const domain = useRecibosActions();
  const [form, setForm] = useState<RecibosFormState>({
    versionId: '',
    releasedByUserId: '',
    comments: '',
  });
  const [activeAction, setActiveAction] = useState<RecibosAction>('snapshots');

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

  const updateField = useCallback((key: keyof RecibosFormState, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }, []);

  const runSnapshots = useCallback(async () => {
    if (!versionIdParsed) {
      toast.error('Debes capturar un ID de version valido.');
      return;
    }

    try {
      await domain.ejecutarSnapshots(versionIdParsed);
      toast.success('Snapshots generados correctamente.');
    } catch {
      toast.error('No se pudieron generar los snapshots.');
    }
  }, [domain, versionIdParsed]);

  const runReceipts = useCallback(async () => {
    if (!versionIdParsed) {
      toast.error('Debes capturar un ID de version valido.');
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

  const runCoreSync = useCallback(async () => {
    if (!versionIdParsed) {
      toast.error('Debes capturar un ID de version valido.');
      return;
    }

    if (!receiptsDone) {
      toast.error('Primero debes generar los recibos.');
      return;
    }

    try {
      await domain.ejecutarCoreSync(versionIdParsed);
      toast.success('Sincronizacion a core completada.');
    } catch {
      toast.error('No se pudo sincronizar a core.');
    }
  }, [domain, receiptsDone, versionIdParsed]);

  const runRelease = useCallback(async () => {
    if (!versionIdParsed) {
      toast.error('Debes capturar un ID de version valido.');
      return;
    }

    if (!releasedByUserIdParsed) {
      toast.error('Debes capturar un ID de usuario valido para la liberacion.');
      return;
    }

    try {
      await domain.ejecutarLiberacion(versionIdParsed, {
        releasedByUserId: releasedByUserIdParsed,
        comments: form.comments.trim(),
      });
      toast.success('Version liberada correctamente.');
    } catch {
      toast.error('No se pudo liberar la version.');
    }
  }, [domain, form.comments, releasedByUserIdParsed, versionIdParsed]);

  const executeActiveAction = useCallback(async () => {
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
  }, [activeAction, runCoreSync, runReceipts, runSnapshots]);

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
    domain.coreSync.loading,
    domain.receipts.loading,
    domain.snapshots.loading,
  ]);

  const currentTitle = useMemo(() => {
    switch (activeAction) {
      case 'snapshots':
        return 'Generacion de snapshots';
      case 'recibos':
        return 'Generacion de recibos';
      case 'sincronizacion':
        return 'Sincronizacion a core';
    }
  }, [activeAction]);

  const currentDescription = useMemo(() => {
    switch (activeAction) {
      case 'snapshots':
        return 'Construye snapshots consolidados desde staging para la version seleccionada.';
      case 'recibos':
        return 'Genera recibos y su detalle asociado a partir de snapshots previos.';
      case 'sincronizacion':
        return 'Ejecuta la sincronizacion complementaria a core para la version activa.';
    }
  }, [activeAction]);

  const canExecute = useMemo(() => {
    switch (activeAction) {
      case 'snapshots':
        return Boolean(versionIdParsed);
      case 'recibos':
        return Boolean(versionIdParsed && snapshotsDone);
      case 'sincronizacion':
        return Boolean(versionIdParsed && receiptsDone);
    }
  }, [activeAction, receiptsDone, snapshotsDone, versionIdParsed]);

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
      coreSyncDone,
      receiptsDone,
      releaseDone,
      releasedByUserIdParsed,
      snapshotsDone,
      versionIdParsed,
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
    [coreSyncDone, receiptsDone, releaseDone, snapshotsDone]
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
    currentTitle,
    currentDescription,
    currentLoading,
    canExecute,
    executeActiveAction,
    releaseLoading: domain.release.loading,
    canRelease: Boolean(versionIdParsed && releasedByUserIdParsed),
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
