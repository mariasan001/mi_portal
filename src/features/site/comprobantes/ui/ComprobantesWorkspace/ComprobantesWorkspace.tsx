'use client';

import type { ComponentType } from 'react';
import { ArrowUpLeft } from 'lucide-react';

import { COMPROBANTES_ACCESS_ITEMS } from '../../model/comprobantes.constants';
import type { ComprobantesView } from '../../model/comprobantes.types';
import ComprobanteQuincenalForm from '../ComprobanteQuincenalForm/ComprobanteQuincenalForm';
import s from './ComprobantesWorkspace.module.css';

type Props = {
  view: Exclude<ComprobantesView, 'menu'>;
  onBack: () => void;
};

type WorkspaceRenderableView = Exclude<ComprobantesView, 'menu'>;

const WORKSPACE_COMPONENTS: Partial<Record<WorkspaceRenderableView, ComponentType>> = {
  'comprobante-quincenal': ComprobanteQuincenalForm,
};

function WorkspacePlaceholder() {
  return (
    <div className={s.placeholder}>
      <h3 className={s.placeholderTitle}>Modulo en construccion</h3>
      <p className={s.placeholderText}>
        Esta seccion estara disponible proximamente con su formulario correspondiente.
      </p>
    </div>
  );
}

export default function ComprobantesWorkspace({ view, onBack }: Props) {
  const selectedItem = COMPROBANTES_ACCESS_ITEMS.find((item) => item.key === view);

  if (!selectedItem) {
    return null;
  }

  const Icon = selectedItem.icon;
  const ActiveComponent = WORKSPACE_COMPONENTS[view];

  return (
    <section className={s.wrap}>
      <article className={s.activePanel}>
        <header className={s.activeHeader}>
          <div className={s.activeIntro}>
            <div className={s.activeIcon} aria-hidden="true">
              <Icon />
            </div>

            <div className={s.activeCopy}>
              <h2 className={s.activeTitle}>{selectedItem.title}</h2>
              <p className={s.activeText}>{selectedItem.desc}</p>
            </div>
          </div>

          <button
            type="button"
            className={s.collapseBtn}
            onClick={onBack}
            aria-label="Volver a las opciones"
          >
            <ArrowUpLeft size={18} />
          </button>
        </header>

        <div className={s.activeBody}>
          {ActiveComponent ? <ActiveComponent /> : <WorkspacePlaceholder />}
        </div>
      </article>
    </section>
  );
}
