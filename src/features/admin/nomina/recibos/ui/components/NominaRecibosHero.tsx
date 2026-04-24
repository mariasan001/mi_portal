import { FileText, RefreshCw } from 'lucide-react';
import s from './NominaRecibosHero.module.css';

export default function NominaRecibosHero() {
  return (
    <header className={`${s.hero} ${s.enter}`}>
      <div className={s.headerTop}>
        <span className={`${s.kicker} ${s.enterLeft}`}>Nomina</span>

        <div className={`${s.metaBadges} ${s.enterSoft}`}>
          <span className={s.metaBadge}>
            <FileText size={14} />
            Recibos
          </span>

          <span className={s.metaBadge}>
            <RefreshCw size={14} />
            Liberacion y sincronizacion
          </span>
        </div>
      </div>

      <div className={s.content}>
        <h1 className={`${s.title} ${s.enterSoft}`}>Liberacion de Nomina</h1>

        <p className={`${s.subtitle} ${s.enterSoftDelay}`}>
          Gestiona la generacion, liberacion y sincronizacion de recibos de nomina.
        </p>
      </div>
    </header>
  );
}
