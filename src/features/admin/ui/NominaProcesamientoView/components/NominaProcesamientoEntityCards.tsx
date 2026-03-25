import { AlertTriangle, BarChart3, Eye } from 'lucide-react';
import s from './NominaProcesamientoEntityCards.module.css';

type ProcesamientoView = 'summary' | 'preview' | 'errors';

type Props = {
  activeView: ProcesamientoView;
  onSelect: (view: ProcesamientoView) => void;
};

export default function NominaProcesamientoEntityCards({
  activeView,
  onSelect,
}: Props) {
  return (
    <section className={s.grid}>
      <button
        type="button"
        className={`${s.card} ${
          activeView === 'summary' ? s.active : s.inactive
        }`}
        onClick={() => onSelect('summary')}
      >
        <div className={s.iconWrap}>
          <div className={s.icon}>
            <BarChart3 size={20} />
          </div>
        </div>

        <div className={s.body}>
          <div className={s.headRow}>
            <h2>Resumen</h2>
            {activeView === 'summary' ? (
              <span className={s.stateBadge}>Activo</span>
            ) : null}
          </div>

          <p>
            Consulta métricas generales del archivo procesado, estatus y conteos
            principales.
          </p>
        </div>
      </button>

      <button
        type="button"
        className={`${s.card} ${
          activeView === 'preview' ? s.active : s.inactive
        }`}
        onClick={() => onSelect('preview')}
      >
        <div className={s.iconWrap}>
          <div className={s.icon}>
            <Eye size={20} />
          </div>
        </div>

        <div className={s.body}>
          <div className={s.headRow}>
            <h2>Preview</h2>
            {activeView === 'preview' ? (
              <span className={s.stateBadge}>Activo</span>
            ) : null}
          </div>

          <p>
            Revisa una muestra de filas procesadas para validar la información
            operativa del archivo.
          </p>
        </div>
      </button>

      <button
        type="button"
        className={`${s.card} ${
          activeView === 'errors' ? s.active : s.inactive
        }`}
        onClick={() => onSelect('errors')}
      >
        <div className={s.iconWrap}>
          <div className={s.icon}>
            <AlertTriangle size={20} />
          </div>
        </div>

        <div className={s.body}>
          <div className={s.headRow}>
            <h2>Errores</h2>
            {activeView === 'errors' ? (
              <span className={s.stateBadge}>Activo</span>
            ) : null}
          </div>

          <p>
            Consulta filas con incidencias detectadas durante el procesamiento
            para revisar el motivo del error.
          </p>
        </div>
      </button>
    </section>
  );
}