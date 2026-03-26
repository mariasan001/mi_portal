import { Search } from 'lucide-react';
import s from './NominaBusquedaRecibosToolbar.module.css';

type Props = {
  claveSp: string;
  periodCode: string;
  loading: boolean;
  canSearch: boolean;
  onChangeClaveSp: (value: string) => void;
  onChangePeriodCode: (value: string) => void;
  onSearch: () => void;
};

export default function NominaBusquedaRecibosToolbar({
  claveSp,
  periodCode,
  loading,
  canSearch,
  onChangeClaveSp,
  onChangePeriodCode,
  onSearch,
}: Props) {
  return (
    <section className={s.toolbar}>
      <div className={s.fieldsGrid}>
        <label className={s.field}>
          <span>Clave SP</span>
          <div className={s.inputWrap}>
            <Search size={17} className={s.icon} />
            <input
              value={claveSp}
              onChange={(e) => onChangeClaveSp(e.target.value)}
              placeholder="Ej. ABC12345"
            />
          </div>
        </label>

        <label className={s.field}>
          <span>Period code</span>
          <div className={s.inputWrap}>
            <Search size={17} className={s.icon} />
            <input
              value={periodCode}
              onChange={(e) => onChangePeriodCode(e.target.value)}
              placeholder="Ej. 2025-06"
            />
          </div>
        </label>
      </div>

      <div className={s.actions}>
        <button
          type="button"
          className={s.searchBtn}
          onClick={onSearch}
          disabled={!canSearch || loading}
        >
          {loading ? 'Consultando...' : 'Buscar recibos'}
        </button>
      </div>
    </section>
  );
}