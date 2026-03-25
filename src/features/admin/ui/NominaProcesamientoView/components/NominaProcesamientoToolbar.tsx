import { RotateCcw, Search } from 'lucide-react';
import s from './NominaProcesamientoToolbar.module.css';

type ProcesamientoView = 'summary' | 'preview' | 'errors';

type Props = {
  activeView: ProcesamientoView;
  fileId: string;
  limit: string;
  loading: boolean;
  canSubmit: boolean;
  onFileIdChange: (value: string) => void;
  onLimitChange: (value: string) => void;
  onConsult: () => void;
  onReset: () => void;
};

function getLabel(view: ProcesamientoView) {
  if (view === 'summary') return 'Consultar resumen';
  if (view === 'preview') return 'Consultar preview';
  return 'Consultar errores';
}

export default function NominaProcesamientoToolbar({
  activeView,
  fileId,
  limit,
  loading,
  canSubmit,
  onFileIdChange,
  onLimitChange,
  onConsult,
  onReset,
}: Props) {
  return (
    <section className={s.toolbar}>
      <div className={s.left}>
        <label className={s.label} htmlFor="nomina-procesamiento-file-id">
          fileId
        </label>

        <div className={s.searchSurface}>
          <div className={s.inputWrap}>
            <Search size={17} className={s.icon} />

            <input
              id="nomina-procesamiento-file-id"
              type="number"
              min="1"
              value={fileId}
              onChange={(e) => onFileIdChange(e.target.value)}
              placeholder="Ej. 40"
            />
          </div>

          {activeView !== 'summary' ? (
            <div className={s.limitWrap}>
              <input
                type="number"
                min="1"
                value={limit}
                onChange={(e) => onLimitChange(e.target.value)}
                placeholder={activeView === 'errors' ? '50' : '20'}
              />
            </div>
          ) : null}

          <button
            type="button"
            className={s.searchBtn}
            onClick={onConsult}
            disabled={!canSubmit}
          >
            {loading ? 'Consultando...' : getLabel(activeView)}
          </button>
        </div>
      </div>

      <div className={s.right}>
        <button
          type="button"
          className={s.resetBtn}
          onClick={onReset}
          disabled={loading}
        >
          <RotateCcw size={17} />
          <span>Limpiar</span>
        </button>
      </div>
    </section>
  );
}