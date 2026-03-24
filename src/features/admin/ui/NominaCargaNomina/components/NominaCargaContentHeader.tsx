import { ChevronLeft } from 'lucide-react';

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
        <h3>{title}</h3>
      </div>

      {showBackButton ? (
        <button type="button" className={s.backBtn} onClick={onBack}>
          <ChevronLeft size={16} />
          Regresar
        </button>
      ) : null}
    </div>
  );
}