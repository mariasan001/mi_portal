import { FileText, RefreshCw } from 'lucide-react';
import s from './NominaRecibosHero.module.css';

export default function NominaRecibosHero() {
  return (
    <header className={s.hero}>
      <div className={s.headerTop}>
        <span className={s.kicker}>Nómina</span>

        <div className={s.metaBadges}>
          <span className={s.metaBadge}>
            <FileText size={14} />
            Recibos
          </span>

          <span className={s.metaBadge}>
            <RefreshCw size={14} />
            Liberación y sincronización
          </span>
        </div>
      </div>

      <div className={s.content}>
        <h1 className={s.title}>Recibos, liberación y sincronización</h1>

        <p className={s.subtitle}>
          Ejecuta el flujo operativo sobre una versión para generar snapshots,
          construir recibos.
        </p>
      </div>
    </header>
  );
}