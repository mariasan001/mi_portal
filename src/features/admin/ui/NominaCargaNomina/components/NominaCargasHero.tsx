import { Database, FileArchive, PlayCircle } from 'lucide-react';
import s from './NominaCargasHero.module.css';

export default function NominaCargasHero() {
  return (
    <header className={s.hero}>
      <div className={s.headerTop}>
        <span className={s.kicker}>Nómina</span>

        <div className={s.metaBadges}>
          <span className={s.metaBadge}>
            <FileArchive size={14} />
            Catálogo
          </span>

          <span className={s.metaBadge}>
            <Database size={14} />
            Nómina
          </span>

          <span className={s.metaBadge}>
            <PlayCircle size={14} />
            Procesamiento
          </span>
        </div>
      </div>

      <div className={s.content}>
        <h1 className={s.title}>Carga de catálogo y nómina</h1>

        <p className={s.subtitle}>
          Sube, ejecuta y da seguimiento a archivos operativos del flujo de
          catálogo y staging de nómina desde una sola sesión.
        </p>
      </div>
    </header>
  );
}