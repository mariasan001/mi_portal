import RecibosResultPanel from './RecibosResultPanel';
import s from './NominaRecibosResultsSection.module.css';

type Props = {
  snapshots: Record<string, unknown> | null;
  receipts: Record<string, unknown> | null;
  release: Record<string, unknown> | null;
  coreSync: Record<string, unknown> | null;
};

export default function NominaRecibosResultsSection({
  snapshots,
  receipts,
  release,
  coreSync,
}: Props) {
  return (
    <section className={s.section}>
      <div className={s.header}>
        <h3>Resultados</h3>
        <p>Resumen técnico de las respuestas obtenidas en cada acción ejecutada.</p>
      </div>

      <div className={s.stack}>
        <RecibosResultPanel title="Resultado de snapshots" data={snapshots} />
        <RecibosResultPanel title="Resultado de recibos" data={receipts} />
        <RecibosResultPanel title="Resultado de liberación" data={release} />
        <RecibosResultPanel title="Resultado de sincronización core" data={coreSync} />
      </div>
    </section>
  );
}