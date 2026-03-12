'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { FiArrowRight, FiLock, FiUnlock } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

import s from './QuickAccessSection.module.css';
import { useRevealMotion } from '@/hooks/useRevealMotion';
import { QUICK_ACCESS_ITEMS } from './constants/quickAccess.items';
import { useAuth } from '@/features/auth';

const NAV_OFFSET = 118;

export default function QuickAccessSection() {
  const router = useRouter();
  const { isAuthenticated, setAppCode } = useAuth();

  const [unlockFx, setUnlockFx] = useState(false);
  const [hasUnlocked, setHasUnlocked] = useState(false);
  const [sectionPulse, setSectionPulse] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);

  const { ref: motionRef, className } = useRevealMotion<HTMLDivElement>({
    threshold: 0.25,
    thresholdPx: 2,
  });

  const scrollToSection = useCallback(() => {
    if (!sectionRef.current) return;

    const top =
      window.scrollY +
      sectionRef.current.getBoundingClientRect().top -
      NAV_OFFSET;

    window.scrollTo({
      top,
      behavior: 'smooth',
    });
  }, []);

  const runUnlockExperience = useCallback(() => {
    let focusTarget = '';
    let unlockMarker = '';

    try {
      focusTarget = sessionStorage.getItem('portal_post_login_focus') ?? '';
      unlockMarker = sessionStorage.getItem('portal_unlock_fx') ?? '';
    } catch {
      return;
    }

    if (focusTarget !== 'quick-access') return;

    scrollToSection();
    setSectionPulse(true);

    const unlockTimer = window.setTimeout(() => {
      if (unlockMarker === '1') {
        setUnlockFx(true);
        setHasUnlocked(true);
      }

      try {
        sessionStorage.removeItem('portal_post_login_focus');
        sessionStorage.removeItem('portal_unlock_fx');
      } catch {
        // noop
      }
    }, 620);

    const resetUnlockTimer = window.setTimeout(() => {
      setUnlockFx(false);
    }, 1800);

    const resetPulseTimer = window.setTimeout(() => {
      setSectionPulse(false);
    }, 2200);

    return () => {
      window.clearTimeout(unlockTimer);
      window.clearTimeout(resetUnlockTimer);
      window.clearTimeout(resetPulseTimer);
    };
  }, [scrollToSection]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let cleanup: (() => void) | undefined;

    const start = window.setTimeout(() => {
      cleanup = runUnlockExperience();
    }, 0);

    return () => {
      window.clearTimeout(start);
      cleanup?.();
    };
  }, [isAuthenticated, runUnlockExperience]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const onFocusQuickAccess = () => {
      window.setTimeout(() => {
        cleanup?.();
        cleanup = runUnlockExperience();
      }, 0);
    };

    window.addEventListener('portal:focus-quick-access', onFocusQuickAccess);

    return () => {
      window.removeEventListener('portal:focus-quick-access', onFocusQuickAccess);
      cleanup?.();
    };
  }, [runUnlockExperience]);

  function onOpen(item: (typeof QUICK_ACCESS_ITEMS)[number]) {
    if (item.appCode) setAppCode(item.appCode);

    if (item.requiresAuth && !isAuthenticated) {
      const q = new URLSearchParams();

      if (item.appCode) q.set('appCode', item.appCode);
      q.set('returnTo', item.href);

      router.push(`/login?${q.toString()}`);
      return;
    }

    router.push(item.href);
  }

  return (
    <section
      id="quick-access"
      ref={sectionRef}
      className={`${s.wrap} ${sectionPulse ? s.sectionPulse : ''}`}
      aria-label="Accesos rápidos"
    >
      <div
        ref={motionRef}
        className={className(s.inner, s.isIn, s.dirDown, s.dirUp)}
      >
        <header className={s.header}>
          <h2>Accesos Rápidos</h2>
          <p>Ingresa directamente a los sistemas institucionales.</p>
        </header>

        <div className={s.grid}>
          {QUICK_ACCESS_ITEMS.map((item) => {
            const locked = Boolean(item.requiresAuth && !isAuthenticated);
            const isUnlocked = Boolean(item.requiresAuth && isAuthenticated && hasUnlocked);
            const playUnlockFx = Boolean(item.requiresAuth && isAuthenticated && unlockFx);

            return (
              <button
                key={item.title}
                type="button"
                className={[
                  s.card,
                  locked ? s.cardLocked : '',
                  playUnlockFx ? s.cardUnlocked : '',
                ].join(' ')}
                onClick={() => onOpen(item)}
              >
                {item.requiresAuth ? (
                  <span
                    className={[
                      s.lockBadgeFloating,
                      locked ? s.locked : '',
                      isUnlocked ? s.unlocked : '',
                    ].join(' ')}
                    aria-label={locked ? 'Acceso bloqueado' : 'Acceso desbloqueado'}
                    title={locked ? 'Acceso bloqueado' : 'Acceso desbloqueado'}
                  >
                    <span
                      className={`${s.miniLockSwap} ${
                        isUnlocked ? s.miniLockSwapOpen : ''
                      }`}
                    >
                      <span className={`${s.miniLockLayer} ${s.miniClosed}`}>
                        <FiLock />
                      </span>
                      <span className={`${s.miniLockLayer} ${s.miniOpen}`}>
                        <FiUnlock />
                      </span>
                    </span>
                  </span>
                ) : null}

                <div className={s.iconWrap}>
                  <div className={s.icon}>{item.icon}</div>
                </div>

                <div className={s.content}>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>

                <span className={s.arrowWrap} aria-hidden="true">
                  <FiArrowRight className={s.arrow} />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}