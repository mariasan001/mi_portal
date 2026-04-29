import s from '@/features/admin/nomina/shared/ui/NominaExplorerToolbar/NominaExplorerToolbar.module.css';

type Option = {
  label: string;
  value: string;
};

type Props = {
  selectedPeriodId: string;
  options: Option[];
  helperText: string;
  loading: boolean;
  onSelectPeriod: (value: string) => void;
};

export default function NominaMonitoreoToolbar({
  selectedPeriodId,
  options,
  helperText,
  loading,
  onSelectPeriod,
}: Props) {
  return (
    <section className={s.toolbar}>
      <div
        className={s.controls}
        style={{ gridTemplateColumns: 'minmax(0, 1fr)' }}
      >
        <label className={s.selectField}>
          <span className={s.fieldLabel}>Período</span>
          <select
            value={selectedPeriodId}
            onChange={(event) => onSelectPeriod(event.target.value)}
            disabled={loading}
          >
            <option value="">Selecciona un período</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {helperText ? (
        <p
          style={{
            margin: '8px 0 0',
            color: 'rgba(10, 10, 10, 0.62)',
            fontSize: '11px',
            lineHeight: 1.45,
          }}
        >
          {helperText}
        </p>
      ) : null}
    </section>
  );
}
