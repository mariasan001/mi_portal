import type { NominaRecibosFlowItem } from '../types/nomina-recibos-view.types';
import NominaRecibosStepCard from './NominaRecibosStepCard';
import s from './NominaRecibosFlowSection.module.css';

type Props = {
  items: NominaRecibosFlowItem[];
};

export default function NominaRecibosFlowSection({ items }: Props) {
  const mainFlow = items.filter((item) => item.id !== 'coreSync');
  const secondaryFlow = items.filter((item) => item.id === 'coreSync');

  return (
    <section className={s.section}>
      <div className={s.block}>
        <div className={s.blockHeader}>
          <h3>Flujo principal</h3>
          <p>
            Las primeras tres acciones siguen una secuencia natural de ejecución
            dentro de la sesión.
          </p>
        </div>

        <div className={s.stack}>
          {mainFlow.map((item) => (
            <NominaRecibosStepCard key={item.id} {...item} />
          ))}
        </div>
      </div>

      <div className={s.block}>
        <div className={s.blockHeader}>
          <h3>Acción complementaria</h3>
          <p>
            Esta acción no bloquea la liberación, pero sí forma parte del cierre
            administrativo relacionado.
          </p>
        </div>

        <div className={s.stack}>
          {secondaryFlow.map((item) => (
            <NominaRecibosStepCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}