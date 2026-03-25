import { getStepStatusLabel } from '../utils/nomina-recibos-view.utils';
import type { NominaRecibosStepStatus } from '../types/nomina-recibos-view.types';
import s from './NominaRecibosStepCard.module.css';

type Props = {
  step: string;
  title: string;
  description: string;
  helper?: string;
  status: NominaRecibosStepStatus;
  disabled?: boolean;
  loading?: boolean;
  error?: string | null;
  onRun: () => void;
};

export default function NominaRecibosStepCard({
  step,
  title,
  description,
  helper,
  status,
  disabled = false,
  loading = false,
  error = null,
  onRun,
}: Props) {
  return (
    <article className={s.card} data-status={status}>
      <div className={s.top}>
        <span className={s.stepBadge}>{step}</span>
        <span className={s.statusBadge} data-status={status}>
          {getStepStatusLabel(status)}
        </span>
      </div>

      <div className={s.body}>
        <h3>{title}</h3>
        <p>{description}</p>
        {helper ? <small>{helper}</small> : null}
        {error ? <div className={s.errorBox}>{error}</div> : null}
      </div>

      <div className={s.footer}>
        <button
          type="button"
          className={s.primaryButton}
          onClick={onRun}
          disabled={disabled || loading}
        >
          {loading ? 'Procesando...' : 'Ejecutar'}
        </button>
      </div>
    </article>
  );
}