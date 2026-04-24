import { AlertTriangle, Eye, FileSpreadsheet } from 'lucide-react';
import s from './NominaProcesamientoHero.module.css';

export default function NominaProcesamientoHero() {
  return (
    <header className={`${s.hero} ${s.enter}`}>
      <div className={s.headerTop}>
        <span className={`${s.kicker} ${s.enterLeft}`}>Nomina</span>

        <div className={`${s.metaBadges} ${s.enterSoft}`}>
          <span className={s.metaBadge}>
            <FileSpreadsheet size={13} />
            Archivo
          </span>

          <span className={s.metaBadge}>
            <Eye size={13} />
            Preview
          </span>

          <span className={s.metaBadge}>
            <AlertTriangle size={13} />
            Errores
          </span>
        </div>
      </div>

      <div className={s.content}>
        <h1 className={`${s.title} ${s.enterSoft}`}>Revision del procesamiento</h1>

        <p className={`${s.subtitle} ${s.enterSoftDelay}`}>
          Consulta el resumen del staging, una muestra de filas procesadas y el detalle de
          filas con error por archivo.
        </p>
      </div>
    </header>
  );
}
