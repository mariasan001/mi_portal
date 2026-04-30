import s from './NominaProcesamientoToolbar.module.css';

type Props = {
  periodFilter: string;
  periodOptions: string[];
  nameFilter: string;
  nameOptions: string[];
  loading: boolean;
  onPeriodFilterChange: (value: string) => void;
  onNameFilterChange: (value: string) => void;
};

export default function NominaProcesamientoToolbar({
  periodFilter,
  periodOptions,
  nameFilter,
  nameOptions,
  loading,
  onPeriodFilterChange,
  onNameFilterChange,
}: Props) {
  return (
    <section className={s.toolbar}>
      <div className={s.controls}>
        <label className={s.filterField}>
          <span className={s.fieldLabel}>Periodo</span>
          <select
            value={periodFilter}
            onChange={(event) => onPeriodFilterChange(event.target.value)}
            disabled={loading}
          >
            <option value="all">Todos</option>
            {periodOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className={s.filterField}>
          <span className={s.fieldLabel}>Nombre</span>
          <select
            value={nameFilter}
            onChange={(event) => onNameFilterChange(event.target.value)}
            disabled={loading}
          >
            <option value="all">Todos</option>
            {nameOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
