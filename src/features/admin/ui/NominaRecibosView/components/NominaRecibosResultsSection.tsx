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
  const mainPanelConfig = getMainPanelConfig({
    activeAction,
    snapshots,
    receipts,
    coreSync,
  });

  return (
    <section className={s.section}>
      <div className={s.stack}>
        <div className={s.header}>
          <h3>{mainPanelConfig.heading}</h3>
          <p>{mainPanelConfig.description}</p>
        </div>

        <RecibosResultPanel
          title={mainPanelConfig.title}
          data={mainPanelConfig.data}
        />

        <div className={s.header}>
          <h3>Resultado de liberación</h3>
          <p>
            Consulta aquí la respuesta técnica registrada cuando se ejecute la
            liberación de la versión.
          </p>
        </div>

        <RecibosResultPanel
          title="Resultado de liberación"
          data={release}
        />
      </div>
    </section>
  );
}

function getMainPanelConfig(params: {
  activeAction: NominaRecibosAction;
  snapshots: Record<string, unknown> | null;
  receipts: Record<string, unknown> | null;
  coreSync: Record<string, unknown> | null;
}) {
  const { activeAction, snapshots, receipts, coreSync } = params;

  switch (activeAction) {
    case 'snapshots':
      return {
        heading: 'Resultado del flujo principal',
        description:
          'Consulta la respuesta técnica obtenida al generar snapshots para la versión seleccionada.',
        title: 'Resultado de snapshots',
        data: snapshots,
      };

    case 'recibos':
      return {
        heading: 'Resultado del flujo principal',
        description:
          'Consulta la respuesta técnica obtenida al generar recibos para la versión seleccionada.',
        title: 'Resultado de recibos',
        data: receipts,
      };

    case 'sincronizacion':
      return {
        heading: 'Resultado del flujo principal',
        description:
          'Consulta la respuesta técnica obtenida al ejecutar la sincronización a core.',
        title: 'Resultado de sincronización',
        data: coreSync,
      };

    default:
      return {
        heading: 'Resultado del flujo principal',
        description: 'Consulta el resultado de la acción ejecutada.',
        title: 'Resultado',
        data: null,
      };
  }
}