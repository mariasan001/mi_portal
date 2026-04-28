import { ArrowDownWideNarrow, Plus, Search } from 'lucide-react';

import s from './VersionesExplorerToolbar.module.css';

type Props = {
  onCreate: () => void;
  onQueryChange: (value: string) => void;
  onStageChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSortChange: (value: 'asc' | 'desc') => void;
  query: string;
  sortValue: 'asc' | 'desc';
  stageOptions: string[];
  stageValue: string;
  statusOptions: string[];
  statusValue: string;
};

export default function VersionesExplorerToolbar({
  onCreate,
  onQueryChange,
  onStageChange,
  onStatusChange,
  onSortChange,
  query,
  sortValue,
  stageOptions,
  stageValue,
  statusOptions,
  statusValue,
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
              placeholder="Buscar por versión, período o etapa"
            />
          </div>
        </label>

        <label className={s.selectField}>
          <span className={s.fieldLabel}>Etapa</span>
          <select
            value={stageValue}
            onChange={(event) => onStageChange(event.target.value)}
          >
            <option value="all">Todas</option>
            {stageOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <label className={s.selectField}>
          <span className={s.fieldLabel}>Estatus</span>
          <select
            value={statusValue}
            onChange={(event) => onStatusChange(event.target.value)}
          >
            <option value="all">Todos</option>
            {statusOptions.map((value) => (
              <option key={value} value={value}>
                {value}
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
              <option value="desc">Mayor versión primero</option>
              <option value="asc">Menor versión primero</option>
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
