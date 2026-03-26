import { FileSearch, Shield } from 'lucide-react';
import s from './NominaAuditoriaHero.module.css';

export default function NominaAuditoriaHero() {
  return (
    <header className={s.hero}>
      <div className={s.headerTop}>
        <span className={s.kicker}>Nómina</span>

        <div className={s.metaBadges}>
          <span className={s.metaBadge}>
            <FileSearch size={14} />
            Auditoría
          </span>

          <span className={s.metaBadge}>
            <Shield size={14} />
            Trazabilidad
          </span>
        </div>
      </div>

      <div className={s.content}>
        <h1 className={s.title}>Auditorías</h1>

        <p className={s.subtitle}>
          Consulta los eventos administrativos de liberación y cancelación con
          filtros por versión, periodo, etapa, recibo o llave de negocio.
        </p>
      </div>
    </header>
  );
}