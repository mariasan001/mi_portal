import { Activity, CalendarRange, ShieldCheck } from 'lucide-react';
import s from './NominaMonitoreoHero.module.css';

export default function NominaMonitoreoHero() {
  return (
    <header className={s.hero}>
      <div className={s.headerTop}>
        <span className={s.kicker}>Nómina</span>

        <div className={s.metaBadges}>
          <span className={s.metaBadge}>
            <CalendarRange size={14} />
            Periodo
          </span>

          <span className={s.metaBadge}>
            <Activity size={14} />
            Monitoreo
          </span>

          <span className={s.metaBadge}>
            <ShieldCheck size={14} />
            Estado
          </span>
        </div>
      </div>

      <div className={s.content}>
        <h1 className={s.title}>Monitoreo del periodo</h1>

        <p className={s.subtitle}>
          Consulta el estado resumido del periodo de nómina, incluyendo banderas
          de carga, validación, liberación.
        </p>
      </div>
    </header>
  );
}