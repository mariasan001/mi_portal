'use client';

import s from './QuickAccessSection.module.css';
import { FiArrowRight } from 'react-icons/fi';

import { useRevealMotion } from '@/hooks/useRevealMotion';
import { QUICK_ACCESS_ITEMS } from './constants/quickAccess.items';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth';

export default function QuickAccessSection() {
  const router = useRouter();
  const { isAuthenticated, setAppCode } = useAuth();

  const { ref: sectionRef, className } = useRevealMotion<HTMLElement>({
    threshold: 0.25,
    thresholdPx: 2,
  });

  function onOpen(item: (typeof QUICK_ACCESS_ITEMS)[number]) {
    // ✅ guardar appCode si el item lo trae
    if (item.appCode) setAppCode(item.appCode);

    // ✅ gate de login
    if (item.requiresAuth && !isAuthenticated) {
      const q = new URLSearchParams();
      if (item.appCode) q.set('appCode', item.appCode);
      q.set('returnTo', item.href);
      router.push(`/login?${q.toString()}`);
      return;
    }

    // ✅ directo
    router.push(item.href);
  }

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
            <button
              key={item.title}
              type="button"
              className={s.card}
              onClick={() => onOpen(item)}
            >
              <div className={s.icon}>{item.icon}</div>

              <div className={s.content}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>

              <FiArrowRight className={s.arrow} aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}