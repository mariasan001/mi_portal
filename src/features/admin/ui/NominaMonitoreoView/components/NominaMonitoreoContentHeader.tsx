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
    <div className={`${s.header} ${s.enter}`}>
      <div className={s.copy}>
        <span className={`${s.eyebrow} ${s.enterLeft}`}>{eyebrow}</span>
        <h3 className={`${s.title} ${s.enterSoft}`}>{title}</h3>
        {description ? (
          <p className={`${s.description} ${s.enterSoftDelay}`}>{description}</p>
        ) : null}
      </div>
    </div>
  );
}
