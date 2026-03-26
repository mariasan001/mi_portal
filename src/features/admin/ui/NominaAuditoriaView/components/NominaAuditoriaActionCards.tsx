import { Ban, ShieldCheck } from 'lucide-react';
import type { NominaAuditoriaAction } from '../types/nomina-auditoria-view.types';
import s from './NominaAuditoriaActionCards.module.css';

type Props = {
  activeAction: NominaAuditoriaAction;
  onSelect: (value: NominaAuditoriaAction) => void;
};

export default function NominaAuditoriaActionCards({
  activeAction,
  onSelect,
}: Props) {
  return (
    <section className={s.grid}>
      <button
        type="button"
        className={`${s.card} ${
          activeAction === 'liberaciones' ? s.active : s.inactive
        }`}
        onClick={() => onSelect('liberaciones')}
      >
        <div className={s.iconWrap}>
          <div className={s.icon}>
            <ShieldCheck size={20} />
          </div>
        </div>

        <div className={s.body}>
          <div className={s.headRow}>
            <h2>Liberaciones</h2>
            {activeAction === 'liberaciones' ? (
              <span className={s.stateBadge}>Activo</span>
            ) : null}
          </div>

          <p>Consulta la bitácora por versión, periodo o etapa.</p>
        </div>
      </button>

      <button
        type="button"
        className={`${s.card} ${
          activeAction === 'cancelaciones' ? s.active : s.inactive
        }`}
        onClick={() => onSelect('cancelaciones')}
      >
        <div className={s.iconWrap}>
          <div className={s.icon}>
            <Ban size={20} />
          </div>
        </div>

        <div className={s.body}>
          <div className={s.headRow}>
            <h2>Cancelaciones</h2>
            {activeAction === 'cancelaciones' ? (
              <span className={s.stateBadge}>Activo</span>
            ) : null}
          </div>

          <p>Consulta la bitácora por recibo o llave de negocio.</p>
        </div>
      </button>
    </section>
  );
}