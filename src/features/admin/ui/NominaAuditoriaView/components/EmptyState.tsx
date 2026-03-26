import { FileSearch } from 'lucide-react';
import s from './EmptyState.module.css';

type Props = {
  title: string;
  description: string;
};

export default function EmptyState({ title, description }: Props) {
  return (
    <div className={s.empty}>
      <div className={s.iconWrap}>
        <FileSearch size={20} />
      </div>

      <div className={s.copy}>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </div>
  );
}