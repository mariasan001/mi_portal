import { formatUnknownValue } from '@/features/admin/nomina/recibos/model/recibos.selectors';

import s from './RecibosResultPanel.module.css';

type Props = {
  title: string;
  data: Record<string, unknown> | null;
  emptyText?: string;
  tone?: 'primary' | 'secondary';
};

function formatLabel(key: string) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

export default function RecibosResultPanel({
  title,
  data,
  emptyText = 'Aun no hay resultado disponible para esta accion.',
  tone = 'primary',
}: Props) {
  const toneClass = tone === 'secondary' ? s.secondary : s.primary;

  return (
    <section className={`${s.panel} ${toneClass}`}>
      <header className={s.header}>
        <div className={s.headerCopy}>
          {data ? <h3>{title}</h3> : null}
          {data ? (
            <p>Se muestra la respuesta tecnica registrada para esta operacion.</p>
          ) : null}
        </div>

        {data ? (
          <span className={s.countBadge}>{Object.keys(data).length} campos</span>
        ) : null}
      </header>

      {!data ? (
        <div className={s.empty}>
          <p>{emptyText}</p>
        </div>
      ) : (
        <dl className={s.grid}>
          {Object.entries(data).map(([key, value]) => (
            <div className={s.item} key={key}>
              <dt>{formatLabel(key)}</dt>
              <dd>{formatUnknownValue(value)}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
