import { ArrowDownWideNarrow, Plus, Search } from 'lucide-react';

import s from './PeriodosExplorerToolbar.module.css';

type Props = {
  onCreate: () => void;
  onQueryChange: (value: string) => void;
  onQuincenaChange: (value: string) => void;
  onSortChange: (value: 'asc' | 'desc') => void;
  query: string;
  quincenaOptions: number[];
  quincenaValue: string;
  sortValue: 'asc' | 'desc';
};

export default function PeriodosExplorerToolbar({
  onCreate,
  onQueryChange,
  onQuincenaChange,
  onSortChange,
  query,
  quincenaOptions,
  quincenaValue,
  sortValue,
}: Props) {
  return (
    <section className={s.toolbar}>
      <div className={s.controls}>
        <label className={s.searchField}>
          <span className={s.fieldLabel}>Búsqueda</span>
          <div className={s.searchInputWrap}>
            <span className={s.searchIcon}>
              <Search size={16} />
            </span>
            <input
              type="text"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Buscar por ID, año o quincena"
            />
          </div>
        </label>

        <label className={s.selectField}>
          <span className={s.fieldLabel}>Quincena</span>
          <select
            value={quincenaValue}
            onChange={(event) => onQuincenaChange(event.target.value)}
          >
            <option value="all">Todas</option>
            {quincenaOptions.map((value) => (
              <option key={value} value={String(value)}>
                Q{value}
              </option>
            ))}
          </select>
        </label>

        <label className={s.selectField}>
          <span className={s.fieldLabel}>Orden</span>
          <div className={s.selectWithIcon}>
            <span className={s.orderIcon}>
              <ArrowDownWideNarrow size={15} />
            </span>
            <select
              value={sortValue}
              onChange={(event) => onSortChange(event.target.value as 'asc' | 'desc')}
            >
              <option value="desc">Mayor ID primero</option>
              <option value="asc">Menor ID primero</option>
            </select>
          </div>
        </label>

        <div className={s.actions}>
          <button type="button" className={s.createButton} onClick={onCreate}>
            <Plus size={16} />
            <span>Crear nuevo</span>
          </button>
        </div>
      </div>
    </section>
  );
}
