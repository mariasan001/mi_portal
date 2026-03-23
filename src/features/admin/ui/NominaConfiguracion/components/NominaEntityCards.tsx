import { CalendarRange, Layers3 } from 'lucide-react';
import s from './NominaEntityCards.module.css';
import { NominaEntity } from '../types/nomina-configuracion.types';

type Props = {
  activeEntity: NominaEntity;
  onSelect: (entity: NominaEntity) => void;
};

export default function NominaEntityCards({ activeEntity, onSelect }: Props) {
  return (
    <section className={s.grid}>
      <button
        type="button"
        className={`${s.card} ${activeEntity === 'periodo' ? s.active : s.inactive}`}
        onClick={() => onSelect('periodo')}
      >
        <div className={s.iconWrap}>
          <div className={s.icon}>
            <CalendarRange size={20} />
          </div>
        </div>

        <div className={s.body}>
          <div className={s.headRow}>
            <h2>Periodos</h2>
            {activeEntity === 'periodo' ? (
              <span className={s.stateBadge}>Activo</span>
            ) : null}
          </div>

          <p>
            Consulta periodos existentes y registra nuevos periodos de pago con
            sus fechas clave.
          </p>
        </div>
      </button>

      <button
        type="button"
        className={`${s.card} ${activeEntity === 'version' ? s.active : s.inactive}`}
        onClick={() => onSelect('version')}
      >
        <div className={s.iconWrap}>
          <div className={s.icon}>
            <Layers3 size={20} />
          </div>
        </div>

        <div className={s.body}>
          <div className={s.headRow}>
            <h2>Versiones</h2>
            {activeEntity === 'version' ? (
              <span className={s.stateBadge}>Activo</span>
            ) : null}
          </div>

          <p>
            Consulta versiones por ID y crea una nueva versión asociada al
            periodo y etapa correspondiente.
          </p>
        </div>
      </button>
    </section>
  );
}