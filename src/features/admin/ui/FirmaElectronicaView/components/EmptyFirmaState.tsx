import { FileSearch } from 'lucide-react';
import s from './EmptyFirmaState.module.css';

type Props = {
  title: string;
  description: string;
};

export default function EmptyFirmaState({
  title,
  description,
}: Props) {
  return (
    <section className={s.state}>
      <div className={s.iconWrap}>
        <FileSearch size={22} />
      </div>

      <div className={s.copy}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </section>
  );
}