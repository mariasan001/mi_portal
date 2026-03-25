import s from '../NominaRecibosView.module.css';

type Props = {
  step: string;
  title: string;
  description: string;
  helper?: string;
  status?: 'idle' | 'ready' | 'success' | 'blocked';
  disabled?: boolean;
  loading?: boolean;
  error?: string | null;
  onRun: () => void;
};

export default function RecibosActionCard({
  step,
  title,
  description,
  helper,
  status = 'idle',
  disabled = false,
  loading = false,
  error = null,
  onRun,
}: Props) {
  return (
    <article className={s.actionCard} data-status={status}>
      <div className={s.actionCardTop}>
        <span className={s.stepBadge}>{step}</span>
        <span className={s.statusBadge} data-status={status}>
          {status === 'success'
            ? 'Completado'
            : status === 'ready'
              ? 'Listo'
              : status === 'blocked'
                ? 'Bloqueado'
                : 'Pendiente'}
        </span>
      </div>

      <div className={s.actionCardBody}>
        <h3>{title}</h3>
        <p>{description}</p>
        {helper ? <small>{helper}</small> : null}
        {error ? <div className={s.errorBox}>{error}</div> : null}
      </div>

      <div className={s.actionCardFooter}>
        <button
          type="button"
          className={s.primaryButton}
          disabled={disabled || loading}
          onClick={onRun}
        >
          {loading ? 'Procesando...' : 'Ejecutar'}
        </button>
      </div>
    </article>
  );
}