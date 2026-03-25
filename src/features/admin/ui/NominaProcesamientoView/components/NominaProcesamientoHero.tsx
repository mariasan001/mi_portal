import { AlertTriangle, Eye, FileSpreadsheet } from 'lucide-react';
import s from './NominaProcesamientoHero.module.css';

export default function NominaProcesamientoHero() {
  return (
    <header className={s.hero}>
      <div className={s.headerTop}>
        <span className={s.kicker}>Nómina</span>

        <div className={s.metaBadges}>
          <span className={s.metaBadge}>
            <FileSpreadsheet size={14} />
            Archivo
          </span>

          <span className={s.metaBadge}>
            <Eye size={14} />
            Preview
          </span>

          <span className={s.metaBadge}>
            <AlertTriangle size={14} />
            Errores
          </span>
        </div>
      </div>

      <div className={s.content}>
        <h1 className={s.title}>Revisión del procesamiento</h1>

        <p className={s.subtitle}>
          Consulta el resumen del staging, una muestra de filas procesadas y el
          detalle de filas con error por archivo.
        </p>
      </div>
    </header>
  );
}