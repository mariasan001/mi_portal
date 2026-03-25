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
  NominaRecibosFlowItem,
  NominaRecibosFormState,
} from '../types/nomina-recibos-view.types';

export function useNominaRecibosView() {
  const domain = useNominaRecibos();

  const [form, setForm] = useState<NominaRecibosFormState>({
    versionId: '',
    releasedByUserId: '',
    comments: '',
  });

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
      toast.error('Debes capturar un versionId válido.');
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
      toast.error('Debes capturar un versionId válido.');
      return;
    }

    try {
      await domain.ejecutarRecibos(versionIdParsed);
      toast.success('Recibos generados correctamente.');
    } catch {
      toast.error('No se pudieron generar los recibos.');
    }
  }, [domain, versionIdParsed]);

  const runRelease = useCallback(async (): Promise<void> => {
    if (!versionIdParsed) {
      toast.error('Debes capturar un versionId válido.');
      return;
    }

    if (!releasedByUserIdParsed) {
      toast.error('Debes capturar un releasedByUserId válido.');
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

  const runCoreSync = useCallback(async (): Promise<void> => {
    if (!versionIdParsed) {
      toast.error('Debes capturar un versionId válido.');
      return;
    }

    try {
      await domain.ejecutarCoreSync(versionIdParsed);
      toast.success('Sincronización a core completada.');
    } catch {
      toast.error('No se pudo sincronizar a core.');
    }
  }, [domain, versionIdParsed]);

  const flowItems: NominaRecibosFlowItem[] = [
    {
      id: 'snapshots',
      step: '01',
      title: 'Generar snapshots',
      description:
        'Construye snapshots consolidados desde staging para la versión indicada.',
      helper: 'Debe existir una versión válida y staging procesado.',
      status: domain.snapshots.loading
        ? 'running'
        : domain.snapshots.data
          ? 'success'
          : canRunSnapshots
            ? 'ready'
            : 'idle',
      disabled: !canRunSnapshots,
      loading: domain.snapshots.loading,
      error: domain.snapshots.error,
      onRun: runSnapshots,
    },
    {
      id: 'receipts',
      step: '02',
      title: 'Generar recibos',
      description:
        'Crea recibos y detalle de impuestos o conceptos a partir de snapshots previos.',
      helper:
        'Este paso se habilita después de generar snapshots en esta sesión.',
      status: domain.receipts.loading
        ? 'running'
        : domain.receipts.data
          ? 'success'
          : canRunReceipts
            ? 'ready'
            : 'blocked',
      disabled: !canRunReceipts,
      loading: domain.receipts.loading,
      error: domain.receipts.error,
      onRun: runReceipts,
    },
    {
      id: 'release',
      step: '03',
      title: 'Liberar versión',
      description:
        'Marca como liberadas las revisiones de recibo y actualiza el estado del periodo.',
      helper:
        'Se habilita cuando ya se generaron recibos y se capturó el usuario que libera.',
      status: domain.release.loading
        ? 'running'
        : domain.release.data
          ? 'success'
          : canRunRelease
            ? 'ready'
            : 'blocked',
      disabled: !canRunRelease,
      loading: domain.release.loading,
      error: domain.release.error,
      onRun: runRelease,
    },
    {
      id: 'coreSync',
      step: '04',
      title: 'Sincronizar a core',
      description:
        'Sincroniza información vigente del servidor público y la plaza principal a core.',
      helper:
        'Acción complementaria para la sesión administrativa relacionada.',
      status: domain.coreSync.loading
        ? 'running'
        : domain.coreSync.data
          ? 'success'
          : canRunCoreSync
            ? 'ready'
            : 'idle',
      disabled: !canRunCoreSync,
      loading: domain.coreSync.loading,
      error: domain.coreSync.error,
      onRun: runCoreSync,
    },
  ];

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
    versionIdParsed,
    releasedByUserIdParsed,
    flowItems,
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