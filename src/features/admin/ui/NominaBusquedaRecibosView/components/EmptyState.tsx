import { CheckCircle2, FileSearch, SearchX } from 'lucide-react';
import s from './EmptyState.module.css';

type EmptyStateVariant = 'default' | 'success' | 'search';

type Props = {
  title: string;
  description: string;
  variant?: EmptyStateVariant;
};

export default function EmptyState({
  title,
  description,
  variant = 'default',
}: Props) {
  const iconMap = {
    default: <FileSearch size={20} />,
    success: <CheckCircle2 size={20} />,
    search: <SearchX size={20} />,
  };

  return (
    <div className={`${s.empty} ${s[variant]} ${s.enter}`}>
      <div className={`${s.iconWrap} ${s.enterScale}`}>{iconMap[variant]}</div>

      <div className={s.copy}>
        <h4 className={s.enterSoft}>{title}</h4>
        <p className={s.enterSoftDelay}>{description}</p>
      </div>
    </div>
  );
}
