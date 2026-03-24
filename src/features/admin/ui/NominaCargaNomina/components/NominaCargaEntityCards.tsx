import { Database, Files } from 'lucide-react';

import s from './NominaCargaEntityCards.module.css';
import { NominaCargaEntity } from '../types/nomina-cargas.types';

type Props = {
  activeEntity: NominaCargaEntity;
  onSelect: (entity: NominaCargaEntity) => void;
};

export default function NominaCargaEntityCards({
  activeEntity,
  onSelect,
}: Props) {
  return (
    <section className={s.grid}>
      <button
        type="button"
        className={`${s.card} ${
          activeEntity === 'catalogo' ? s.active : s.inactive
        }`}
        onClick={() => onSelect('catalogo')}
      >
        <div className={s.iconWrap}>
          <div className={s.icon}>
            <Files size={20} />
          </div>
        </div>

        <div className={s.body}>
          <div className={s.headRow}>
            <h2>Catálogos</h2>
            {activeEntity === 'catalogo' ? (
              <span className={s.stateBadge}>Activo</span>
            ) : null}
          </div>

          <p>
            Sube archivos DBF, ejecútalos y consulta el resultado del proceso.
          </p>
        </div>
      </button>

      <button
        type="button"
        className={`${s.card} ${
          activeEntity === 'nomina' ? s.active : s.inactive
        }`}
        onClick={() => onSelect('nomina')}
      >
        <div className={s.iconWrap}>
          <div className={s.icon}>
            <Database size={20} />
          </div>
        </div>

        <div className={s.body}>
          <div className={s.headRow}>
            <h2>Nómina</h2>
            {activeEntity === 'nomina' ? (
              <span className={s.stateBadge}>Activo</span>
            ) : null}
          </div>

          <p>
            Ejecuta el staging por fileId y visualiza el resultado más reciente.
          </p>
        </div>
      </button>
    </section>
  );
}