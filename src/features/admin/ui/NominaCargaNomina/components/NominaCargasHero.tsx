

import { CalendarRange, Layers3 } from 'lucide-react';
import s from './NominaCargaContentHeader.module.css';

export default function NominaCargaContentHeader() {
  return (
    <header className={s.hero}>
      <div className={s.headerTop}>
        <span className={s.kicker}>Nómina</span>

        <div className={s.metaBadges}>
          <span className={s.metaBadge}>
            <CalendarRange size={14} />
            Catalogos
          </span>

          <span className={s.metaBadge}>
            <Layers3 size={14} />
            Nomina
          </span>
        </div>
      </div>

      <div className={s.content}>
        <h1 className={s.title}>Carga de Nomina</h1>

        <p className={s.subtitle}>
          Consulta, crea y organiza catálogos de la subida de archivos de nomina 
        </p>
      </div>
    </header>
  );
}