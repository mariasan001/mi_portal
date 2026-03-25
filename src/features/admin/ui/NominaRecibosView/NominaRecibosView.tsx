'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import RecibosActionCard from './components/RecibosActionCard';
import RecibosResultPanel from './components/RecibosResultPanel';
import s from './NominaRecibosView.module.css';
import { useNominaRecibos } from '../../hook/useNominaRecibos';

function parsePositiveInt(value: string): number | null {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return Math.trunc(parsed);
}

export default function NominaRecibosView() {
  const vm = useNominaRecibos();

  const [versionId, setVersionId] = useState('');
  const [releasedByUserId, setReleasedByUserId] = useState('');
  const [comments, setComments] = useState('');

  const versionIdParsed = useMemo(() => parsePositiveInt(versionId), [versionId]);
  const releasedByUserIdParsed = useMemo(
    () => parsePositiveInt(releasedByUserId),
    [releasedByUserId]
  );

  const canRunSnapshots = Boolean(versionIdParsed);
  const canRunReceipts = Boolean(versionIdParsed && vm.snapshots.data);
  const canRunRelease = Boolean(
    versionIdParsed && vm.receipts.data && releasedByUserIdParsed
  );
  const canRunCoreSync = Boolean(versionIdParsed);

  const handleSnapshots = async () => {
    if (!versionIdParsed) {
      toast.error('Debes capturar un versionId válido');
      return;
    }

    try {
      await vm.ejecutarSnapshots(versionIdParsed);
      toast.success('Snapshots generados correctamente');
    } catch {
      toast.error('No se pudieron generar los snapshots');
    }
  };

  const handleReceipts = async () => {
    if (!versionIdParsed) {
      toast.error('Debes capturar un versionId válido');
      return;
    }

    try {
      await vm.ejecutarRecibos(versionIdParsed);
      toast.success('Recibos generados correctamente');
    } catch {
      toast.error('No se pudieron generar los recibos');
    }
  };

  const handleRelease = async () => {
    if (!versionIdParsed) {
      toast.error('Debes capturar un versionId válido');
      return;
    }

    if (!releasedByUserIdParsed) {
      toast.error('Debes capturar un releasedByUserId válido');
      return;
    }

    try {
      await vm.ejecutarLiberacion(versionIdParsed, {
        releasedByUserId: releasedByUserIdParsed,
        comments: comments.trim(),
      });
      toast.success('Versión liberada correctamente');
    } catch {
      toast.error('No se pudo liberar la versión');
    }
  };

  const handleCoreSync = async () => {
    if (!versionIdParsed) {
      toast.error('Debes capturar un versionId válido');
      return;
    }

    try {
      await vm.ejecutarCoreSync(versionIdParsed);
      toast.success('Sincronización a core completada');
    } catch {
      toast.error('No se pudo sincronizar a core');
    }
  };

  return (
    <section className={s.page}>
      <div className={s.hero}>
        <div>
          <p className={s.eyebrow}>Administración de nómina</p>
          <h1>Recibos, liberación y sincronización</h1>
          <p className={s.heroText}>
            Ejecuta el flujo de publicación de recibos sobre una versión:
            snapshots, generación de recibos, liberación y sincronización
            complementaria a core.
          </p>
        </div>
      </div>

      <section className={s.formCard}>
        <div className={s.formGrid}>
          <label className={s.field}>
            <span>Version ID</span>
            <input
              type="number"
              inputMode="numeric"
              value={versionId}
              onChange={(e) => setVersionId(e.target.value)}
              placeholder="Ej. 125"
            />
          </label>

          <label className={s.field}>
            <span>Released By User ID</span>
            <input
              type="number"
              inputMode="numeric"
              value={releasedByUserId}
              onChange={(e) => setReleasedByUserId(e.target.value)}
              placeholder="Ej. 18"
            />
          </label>
        </div>

        <label className={s.field}>
          <span>Comentarios de liberación</span>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Comentario opcional o motivo de liberación"
            rows={4}
          />
        </label>

        <div className={s.helperBox}>
          <strong>Orden recomendado:</strong> primero snapshots, luego recibos,
          después liberación. La sincronización a core es una acción relacionada
          que puede ejecutarse por separado cuando la versión ya tenga fuente
          válida o staging procesado.
        </div>
      </section>

      <section className={s.mainGrid}>
        <div className={s.actionsColumn}>
          <div className={s.sectionHeader}>
            <h2>Flujo principal</h2>
            <p>Las tres acciones del bloque principal siguen una secuencia natural.</p>
          </div>

          <div className={s.actionsStack}>
            <RecibosActionCard
              step="01"
              title="Generar snapshots"
              description="Construye snapshots consolidados desde staging para la versión indicada."
              helper="Debe existir versión válida y staging procesado."
              status={vm.snapshots.data ? 'success' : canRunSnapshots ? 'ready' : 'idle'}
              disabled={!canRunSnapshots}
              loading={vm.snapshots.loading}
              error={vm.snapshots.error}
              onRun={handleSnapshots}
            />

            <RecibosActionCard
              step="02"
              title="Generar recibos"
              description="Crea recibos y detalle de impuestos/conceptos a partir de snapshots previos."
              helper="Este paso se habilita después de generar snapshots en esta sesión."
              status={
                vm.receipts.data
                  ? 'success'
                  : canRunReceipts
                    ? 'ready'
                    : 'blocked'
              }
              disabled={!canRunReceipts}
              loading={vm.receipts.loading}
              error={vm.receipts.error}
              onRun={handleReceipts}
            />

            <RecibosActionCard
              step="03"
              title="Liberar versión"
              description="Marca como liberadas las revisiones de recibo y actualiza el estado del periodo."
              helper="Se habilita cuando ya se generaron recibos y capturaste el releasedByUserId."
              status={
                vm.release.data
                  ? 'success'
                  : canRunRelease
                    ? 'ready'
                    : 'blocked'
              }
              disabled={!canRunRelease}
              loading={vm.release.loading}
              error={vm.release.error}
              onRun={handleRelease}
            />
          </div>

          <div className={s.sectionHeader}>
            <h2>Acción complementaria</h2>
            <p>No forma parte dura de la liberación, pero sí del proceso administrativo relacionado.</p>
          </div>

          <div className={s.actionsStack}>
            <RecibosActionCard
              step="04"
              title="Sincronizar a core"
              description="Sincroniza información vigente del servidor público y la plaza principal a core."
              helper="Puede correr como proceso complementario cuando la versión ya tiene fuente válida o staging procesado."
              status={vm.coreSync.data ? 'success' : canRunCoreSync ? 'ready' : 'idle'}
              disabled={!canRunCoreSync}
              loading={vm.coreSync.loading}
              error={vm.coreSync.error}
              onRun={handleCoreSync}
            />
          </div>
        </div>

        <div className={s.resultsColumn}>
          <RecibosResultPanel
            title="Resultado de snapshots"
            data={vm.snapshots.data}
          />

          <RecibosResultPanel
            title="Resultado de recibos"
            data={vm.receipts.data}
          />

          <RecibosResultPanel
            title="Resultado de liberación"
            data={vm.release.data}
          />

          <RecibosResultPanel
            title="Resultado de sincronización core"
            data={vm.coreSync.data}
          />
        </div>
      </section>
    </section>
  );
}