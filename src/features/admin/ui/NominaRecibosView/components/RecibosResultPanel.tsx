import s from '../NominaRecibosView.module.css';

type Props = {
  title: string;
  data: Record<string, unknown> | null;
};

function formatValue(value: unknown): string {
  if (typeof value === 'boolean') {
    return value ? 'Sí' : 'No';
  }

  if (value === null || value === undefined) {
    return '—';
  }

  return String(value);
}

export default function RecibosResultPanel({ title, data }: Props) {
  if (!data) {
    return (
      <section className={s.resultPanel}>
        <header className={s.resultPanelHeader}>
          <h3>{title}</h3>
        </header>
        <div className={s.emptyResult}>
          Aún no hay resultado disponible para esta acción.
        </div>
      </section>
    );
  }

  return (
    <section className={s.resultPanel}>
      <header className={s.resultPanelHeader}>
        <h3>{title}</h3>
      </header>

      <dl className={s.resultGrid}>
        {Object.entries(data).map(([key, value]) => (
          <div className={s.resultItem} key={key}>
            <dt>{key}</dt>
            <dd>{formatValue(value)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}