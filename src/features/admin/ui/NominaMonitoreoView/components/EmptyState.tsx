import { Inbox } from 'lucide-react';
import s from './EmptyState.module.css';

type Props = {
  title: string;
  description: string;
};

export default function EmptyState({ title, description }: Props) {
  return (
    <div className={`${s.empty} ${s.enter}`}>
      <div className={`${s.iconWrap} ${s.enterScale}`}>
        <Inbox size={18} />
      </div>

      <div className={s.copy}>
        <h4 className={s.enterSoft}>{title}</h4>
        <p className={s.enterSoftDelay}>{description}</p>
      </div>
    </div>
  );
}
