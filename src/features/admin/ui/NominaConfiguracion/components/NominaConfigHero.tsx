import { CalendarRange, Layers3 } from 'lucide-react';
import s from './NominaConfigHero.module.css';

export default function NominaConfigHero() {
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
            <Layers3 size={14} />
            Versión
          </span>
        </div>
      </div>

      <div className={s.content}>
        <h1 className={s.title}>Gestión de periodo y versión</h1>

        <p className={s.subtitle}>
          Consulta, crea y organiza la configuración base del procesamiento de
          nómina desde una sola sesión.
        </p>
      </div>
    </header>
  );
}