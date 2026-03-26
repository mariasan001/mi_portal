import { CalendarRange, Search } from 'lucide-react';
import s from './NominaBusquedaRecibosHero.module.css';

export default function NominaBusquedaRecibosHero() {
  return (
    <header className={s.hero}>
      <div className={s.headerTop}>
        <span className={s.kicker}>Nómina</span>

        <div className={s.metaBadges}>
          <span className={s.metaBadge}>
            <Search size={14} />
            Búsqueda
          </span>

          <span className={s.metaBadge}>
            <CalendarRange size={14} />
            Periodo
          </span>
        </div>
      </div>

      <div className={s.content}>
        <h1 className={s.title}>Búsqueda por servidor público y periodo</h1>

        <p className={s.subtitle}>
          Consulta recibos completos por clave SP y periodo, considerando
          reexpediciones y mostrando encabezado, plazas, detalle fiscal y
          conceptos.
        </p>
      </div>
    </header>
  );
}