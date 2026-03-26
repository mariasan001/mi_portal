import { formatUnknownValue } from '../utils/nomina-recibos-view.utils';
import s from './RecibosResultPanel.module.css';

type Props = {
  title: string;
  data: Record<string, unknown> | null;
};

export default function RecibosResultPanel({ title, data }: Props) {
  return (
    <section className={s.panel}>
      <header className={s.header}>
        <h3>{title}</h3>
      </header>

      {!data ? (
        <div className={s.empty}>
          <p>Aún no hay resultado disponible para esta acción.</p>
        </div>
      ) : (
        <dl className={s.grid}>
          {Object.entries(data).map(([key, value]) => (
            <div className={s.item} key={key}>
              <dt>{key}</dt>
              <dd>{formatUnknownValue(value)}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}