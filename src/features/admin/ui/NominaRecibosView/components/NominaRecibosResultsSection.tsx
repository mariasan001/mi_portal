import type { NominaRecibosAction } from '../types/nomina-recibos-view.types';
import RecibosResultPanel from './RecibosResultPanel';
import s from './NominaRecibosResultsSection.module.css';

type Props = {
  activeAction: NominaRecibosAction;
  snapshots: Record<string, unknown> | null;
  receipts: Record<string, unknown> | null;
  release: Record<string, unknown> | null;
  coreSync: Record<string, unknown> | null;
};

export default function NominaRecibosResultsSection({
  activeAction,
  snapshots,
  receipts,
  release,
  coreSync,
}: Props) {
  const panelConfig = getPanelConfig({
    activeAction,
    snapshots,
    receipts,
    release,
    coreSync,
  });

  return (
    <section className={s.section}>
      <div className={s.header}>
        <h3>{panelConfig.heading}</h3>
        <p>{panelConfig.description}</p>
      </div>

      <RecibosResultPanel title={panelConfig.title} data={panelConfig.data} />
    </section>
  );
}

function getPanelConfig(params: {
  activeAction: NominaRecibosAction;
  snapshots: Record<string, unknown> | null;
  receipts: Record<string, unknown> | null;
  release: Record<string, unknown> | null;
  coreSync: Record<string, unknown> | null;
}) {
  const { activeAction, snapshots, receipts, release, coreSync } = params;

  switch (activeAction) {
    case 'snapshots':
      return {
        heading: 'Resultado de la operación',
        description:
          'Consulta la respuesta técnica obtenida al generar snapshots para la versión seleccionada.',
        title: 'Resultado de snapshots',
        data: snapshots,
      };

    case 'recibos':
      return {
        heading: 'Resultado de la operación',
        description:
          'Consulta la respuesta técnica obtenida al generar recibos para la versión seleccionada.',
        title: 'Resultado de recibos',
        data: receipts,
      };

    case 'liberacion':
      return {
        heading: 'Resultado de la operación',
        description:
          'Consulta la respuesta técnica obtenida al liberar la versión seleccionada.',
        title: 'Resultado de liberación',
        data: release,
      };

    case 'sincronizacion':
      return {
        heading: 'Resultado de la operación',
        description:
          'Consulta la respuesta técnica obtenida al ejecutar la sincronización a core.',
        title: 'Resultado de sincronización',
        data: coreSync,
      };

    default:
      return {
        heading: 'Resultado de la operación',
        description: 'Consulta el resultado de la acción ejecutada.',
        title: 'Resultado',
        data: null,
      };
  }
}