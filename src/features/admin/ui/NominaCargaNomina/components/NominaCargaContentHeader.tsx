import { ArrowLeft } from 'lucide-react';
import s from './NominaCargaContentHeader.module.css';

type Props = {
  eyebrow: string;
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
};

export default function NominaCargaContentHeader({
  eyebrow,
  title,
  showBackButton = false,
  onBack,
}: Props) {
  return (
    <div className={s.header}>
      <div className={s.copy}>
        <span className={s.eyebrow}>{eyebrow}</span>
        <h3 className={s.title}>{title}</h3>
      </div>

      {showBackButton && onBack ? (
        <button type="button" className={s.button} onClick={onBack}>
          <ArrowLeft size={16} />
          Ver resultados
        </button>
      ) : null}
    </div>
  );
}