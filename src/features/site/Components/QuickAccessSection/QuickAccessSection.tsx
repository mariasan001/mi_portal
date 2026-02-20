'use client';

import s from './QuickAccessSection.module.css';
import { FiArrowRight } from 'react-icons/fi';

import { useRevealMotion } from '@/hooks/useRevealMotion';
import { QUICK_ACCESS_ITEMS } from './constants/quickAccess.items';

export default function QuickAccessSection() {
  const { ref: sectionRef, className } = useRevealMotion<HTMLElement>({
    threshold: 0.25,
    thresholdPx: 2,
  });

  return (
    <section
      ref={sectionRef}
      className={className(s.wrap, s.isIn, s.dirDown, s.dirUp)}
      aria-label="Accesos rápidos"
    >
      <div className={s.inner}>
        <header className={s.header}>
          <h2>Accesos Rápidos</h2>
          <p>Ingresa directamente a los sistemas institucionales.</p>
        </header>

        <div className={s.grid}>
          {QUICK_ACCESS_ITEMS.map((item) => (
            <a key={item.title} href={item.href} className={s.card}>
              <div className={s.icon}>{item.icon}</div>

              <div className={s.content}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>

              <FiArrowRight className={s.arrow} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}