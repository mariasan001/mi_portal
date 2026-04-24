import { CheckCircle2, FileSearch, Inbox, SearchX } from 'lucide-react';
import { cx } from '@/utils/cx';
import s from './NominaEmptyState.module.css';

type NominaEmptyStateVariant = 'default' | 'success' | 'search' | 'inbox';
type NominaEmptyStateTone = 'regular' | 'compact';

type Props = {
  title: string;
  description: string;
  variant?: NominaEmptyStateVariant;
  tone?: NominaEmptyStateTone;
};

const iconMap = {
  default: <FileSearch size={20} />,
  success: <CheckCircle2 size={20} />,
  search: <SearchX size={20} />,
  inbox: <Inbox size={18} />,
};

export default function NominaEmptyState({
  title,
  description,
  variant = 'default',
  tone = 'regular',
}: Props) {
  return (
    <div className={cx(s.empty, s[variant], tone === 'compact' && s.compact, s.enter)}>
      <div className={cx(s.iconWrap, s.enterScale)}>{iconMap[variant]}</div>

      <div className={s.copy}>
        <h4 className={s.enterSoft}>{title}</h4>
        <p className={s.enterSoftDelay}>{description}</p>
      </div>
    </div>
  );
}
