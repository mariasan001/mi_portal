import s from './NominaMonitoreoContentHeader.module.css';

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
};

export default function NominaMonitoreoContentHeader({
  eyebrow,
  title,
  description,
}: Props) {
  return (
    <div className={s.header}>
      <div className={s.copy}>
        <span className={s.eyebrow}>{eyebrow}</span>
        <h3 className={s.title}>{title}</h3>
        {description ? <p className={s.description}>{description}</p> : null}
      </div>
    </div>
  );
}