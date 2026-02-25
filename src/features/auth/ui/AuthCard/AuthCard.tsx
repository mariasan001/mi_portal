'use client';

import type { ReactNode } from 'react';
import s from './AuthCard.module.css';

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function AuthCard({ title, subtitle, children }: Props) {
  return (
    <div className={s.wrap}>
      <div className={s.card}>
        <div className={s.head}>
          <div className={s.bar} />
          <div>
            <h1 className={s.title}>{title}</h1>
            {subtitle ? <p className={s.sub}>{subtitle}</p> : null}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}