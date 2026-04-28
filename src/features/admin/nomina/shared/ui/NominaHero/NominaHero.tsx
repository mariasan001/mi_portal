import type { ReactNode } from 'react';
import { cx } from '@/utils/cx';
import s from './NominaHero.module.css';

type Props = {
  subtitle: ReactNode;
  title: string;
};

export default function NominaHero({ subtitle, title }: Props) {
  return (
    <header className={cx(s.hero, s.enter)}>
      <div className={s.copy}>
        <h1 className={cx(s.title, s.enterSoft)}>{title}</h1>
        <p className={cx(s.subtitle, s.enterSoftDelay)}>{subtitle}</p>
      </div>
    </header>
  );
}
