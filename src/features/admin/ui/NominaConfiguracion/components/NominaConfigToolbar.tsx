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
      <div className={s.searchBox}>
        <label className={s.label} htmlFor="nomina-search-id">
          {searchLabel}
        </label>

        <div className={s.control}>
          <Search size={18} className={s.icon} />

          <input
            id="nomina-search-id"
            type="number"
            min="1"
            value={searchId}
            onChange={(e) => onSearchIdChange(e.target.value)}
            placeholder={searchPlaceholder}
          />

          <button type="button" className={s.searchBtn} onClick={onSearch} disabled={!canSearch}>
            {loading ? 'Consultando...' : searchButtonLabel}
          </button>
        </div>
      </div>

      <button type="button" className={s.createBtn} onClick={onCreate}>
        <Plus size={18} />
        Crear nuevo
      </button>
    </section>
  );
}