import { CalendarRange, Search } from 'lucide-react';
import s from './NominaBusquedaRecibosHero.module.css';

export default function NominaBusquedaRecibosHero() {
  return (
    <header className={`${s.hero} ${s.enter}`}>
      <div className={s.headerTop}>
        <span className={`${s.kicker} ${s.enterLeft}`}>Nomina</span>

        <div className={`${s.metaBadges} ${s.enterSoft}`}>
          <span className={s.metaBadge}>
            <Search size={14} />
            Busqueda
          </span>

          <span className={s.metaBadge}>
            <CalendarRange size={14} />
            Servidor y periodo
          </span>
        </div>
      </div>

      <div className={s.content}>
        <h1 className={`${s.title} ${s.enterSoft}`}>Busqueda por servidor</h1>

        <p className={`${s.subtitle} ${s.enterSoftDelay}`}>
          Consulta recibos completos por clave SP
        </p>
      </div>
    </header>
  );
}
