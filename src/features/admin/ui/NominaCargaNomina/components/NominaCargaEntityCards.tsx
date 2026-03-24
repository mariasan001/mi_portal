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
        className={`${s.card} ${activeEntity === 'catalogo' ? s.active : ''}`}
        onClick={() => onSelect('catalogo')}
      >
        <span className={s.iconWrap}>
          <Files size={18} />
        </span>

        <div className={s.copy}>
          <h3>Catálogos</h3>
          <p>Sube archivos DBF, ejecútalos y consulta el resultado del proceso.</p>
        </div>
      </button>

      <button
        type="button"
        className={`${s.card} ${activeEntity === 'nomina' ? s.active : ''}`}
        onClick={() => onSelect('nomina')}
      >
        <span className={s.iconWrap}>
          <Database size={18} />
        </span>

        <div className={s.copy}>
          <h3>Nómina</h3>
          <p>Ejecuta el staging por fileId y visualiza el resultado más reciente.</p>
        </div>
      </button>
    </section>
  );
}