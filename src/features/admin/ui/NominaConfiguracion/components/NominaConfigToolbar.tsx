import { Plus, Search } from 'lucide-react';
import s from './NominaConfigToolbar.module.css';

type Props = {
  searchLabel: string;
  searchPlaceholder: string;
  searchButtonLabel: string;
  searchId: string;
  loading: boolean;
  canSearch: boolean;
  onSearchIdChange: (value: string) => void;
  onSearch: () => void;
  onCreate: () => void;
};

export default function NominaConfigToolbar({
  searchLabel,
  searchPlaceholder,
  searchButtonLabel,
  searchId,
  loading,
  canSearch,
  onSearchIdChange,
  onSearch,
  onCreate,
}: Props) {
  return (
    <section className={s.toolbar}>
      <div className={s.left}>
        <label className={s.label} htmlFor="nomina-search-id">
          {searchLabel}
        </label>

        <div className={s.searchSurface}>
          <div className={s.inputWrap}>
            <Search size={17} className={s.icon} />

            <input
              id="nomina-search-id"
              type="number"
              min="1"
              value={searchId}
              onChange={(e) => onSearchIdChange(e.target.value)}
              placeholder={searchPlaceholder}
            />
          </div>

          <button
            type="button"
            className={s.searchBtn}
            onClick={onSearch}
            disabled={!canSearch}
          >
            {loading ? 'Consultando...' : searchButtonLabel}
          </button>
        </div>
      </div>

      <div className={s.right}>
        <button type="button" className={s.createBtn} onClick={onCreate}>
          <Plus size={17} />
          <span>Crear nuevo</span>
        </button>
      </div>
    </section>
  );
}