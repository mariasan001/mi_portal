import s from './NominaContentHeader.module.css';

type Props = {
  eyebrow: string;
  title: string;
  showBackButton: boolean;
  onBack: () => void;
};

export default function NominaContentHeader({
  eyebrow,
  title,
  showBackButton,
  onBack,
}: Props) {
  return (
    <div className={s.header}>
      <div>
        <p className={s.eyebrow}>{eyebrow}</p>
        <h3 className={s.title}>{title}</h3>
      </div>

      {showBackButton ? (
        <button type="button" className={s.button} onClick={onBack}>
          Ver resultados
        </button>
      ) : null}
    </div>
  );
}