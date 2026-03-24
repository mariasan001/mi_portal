import { Search, RotateCcw } from 'lucide-react';
import s from './NominaMonitoreoToolbar.module.css';

type Props = {
  payPeriodId: string;
  loading: boolean;
  canSubmit: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
};

export default function NominaMonitoreoToolbar({
  payPeriodId,
  loading,
  canSubmit,
  onChange,
  onSubmit,
  onReset,
}: Props) {
  return (
    <section className={s.toolbar}>
      <div className={s.left}>
        <label className={s.label} htmlFor="nomina-monitoreo-period-id">
          payPeriodId
        </label>

        <div className={s.searchSurface}>
          <div className={s.inputWrap}>
            <Search size={17} className={s.icon} />

            <input
              id="nomina-monitoreo-period-id"
              type="number"
              min="1"
              value={payPeriodId}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Ej. 202601"
            />
          </div>

          <button
            type="button"
            className={s.searchBtn}
            onClick={onSubmit}
            disabled={!canSubmit}
          >
            {loading ? 'Consultando...' : 'Consultar estado'}
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