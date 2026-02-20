import React from 'react';
import s from '../GuidesSection.module.css';

type Props = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function SectionBox({ icon, title, subtitle, children }: Props) {
  return (
    <section className={s.box}>
      <div className={s.boxHead}>
        <span className={s.boxIcon} aria-hidden="true">
          {icon}
        </span>
        <div className={s.boxText}>
          <div className={s.boxTitle}>{title}</div>
          {subtitle ? <div className={s.boxSub}>{subtitle}</div> : null}
        </div>
      </div>

      <div className={s.boxBody}>{children}</div>
    </section>
  );
}