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
        className={`${s.card} ${activeEntity === 'periodo' ? s.active : ''}`}
        onClick={() => onSelect('periodo')}
      >
        <div className={s.icon}>
          <CalendarRange size={22} />
        </div>

        <div className={s.body}>
          <h2>Periodos</h2>
          <p>
            Consulta periodos existentes y registra nuevos periodos de pago con
            sus fechas clave.
          </p>
        </div>
      </button>

      <button
        type="button"
        className={`${s.card} ${activeEntity === 'version' ? s.active : ''}`}
        onClick={() => onSelect('version')}
      >
        <div className={s.icon}>
          <Layers3 size={22} />
        </div>

        <div className={s.body}>
          <h2>Versiones</h2>
          <p>
            Consulta versiones por ID y crea una nueva versión asociada al
            periodo y etapa correspondiente.
          </p>
        </div>
      </button>
    </section>
  );
}