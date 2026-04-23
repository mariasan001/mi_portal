import { Activity, CalendarRange, ShieldCheck } from 'lucide-react';
import s from './NominaMonitoreoHero.module.css';

export default function NominaMonitoreoHero() {
  return (
    <header className={`${s.hero} ${s.enter}`}>
      <div className={s.headerTop}>
        <span className={`${s.kicker} ${s.enterLeft}`}>Nomina</span>

        <div className={`${s.metaBadges} ${s.enterSoft}`}>
          <span className={s.metaBadge}>
            <CalendarRange size={13} />
            Periodo
          </span>

          <span className={s.metaBadge}>
            <Activity size={13} />
            Monitoreo
          </span>

          <span className={s.metaBadge}>
            <ShieldCheck size={13} />
            Estado
          </span>
        </div>
      </div>

      <div className={s.content}>
        <h1 className={`${s.title} ${s.enterSoft}`}>Monitoreo del periodo</h1>

        <p className={`${s.subtitle} ${s.enterSoftDelay}`}>
          Consulta el estado resumido del periodo de nómina, incluyendo banderas
          de carga, validación y liberación.
        </p>
      </div>
    </header>
  );
}
