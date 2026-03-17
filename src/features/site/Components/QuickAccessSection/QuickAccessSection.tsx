'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { FiArrowRight, FiLock, FiUnlock } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

import s from './QuickAccessSection.module.css';
import { useRevealMotion } from '@/hooks/useRevealMotion';
import { QUICK_ACCESS_ITEMS } from './constants/quickAccess.items';
import { useAuth } from '@/features/auth';

const NAV_OFFSET = 118;

type OpenAuthModalDetail = {
  source?: 'nav' | 'quick-access';
  returnTo?: string | null;
  appCode?: string | null;
  initialView?: 'login' | 'register' | 'forgot' | 'otp' | 'reset';
};

export default function QuickAccessSection() {
  const router = useRouter();
  const { isAuthenticated, setAppCode } = useAuth();

  const [unlockFx, setUnlockFx] = useState(false);
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
      window.removeEventListener(
        'portal:focus-quick-access',
        onFocusQuickAccess
      );
      cleanup?.();
    };
  }, [runUnlockExperience]);

  function onOpen(item: (typeof QUICK_ACCESS_ITEMS)[number]) {
    if (item.requiresAuth && !isAuthenticated) {
      const detail: OpenAuthModalDetail = {
        source: 'quick-access',
        returnTo: item.href,
        appCode: item.appCode ?? 'PLAT_SERV',
        initialView: 'login',
      };

      window.dispatchEvent(
        new CustomEvent<OpenAuthModalDetail>('portal:open-auth-modal', {
          detail,
        })
      );
      return;
    }

    if (item.appCode) {
      setAppCode(item.appCode);
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
            const isProtected = Boolean(item.requiresAuth);
            const isActuallyLocked = Boolean(isProtected && !isAuthenticated);
            const isActuallyUnlocked = Boolean(isProtected && isAuthenticated);
            const shouldAnimateUnlock = Boolean(isActuallyUnlocked && unlockFx);

            return (
              <button
                key={item.title}
                type="button"
                className={[
                  s.card,
                  isActuallyLocked ? s.cardLocked : '',
                  shouldAnimateUnlock ? s.cardUnlocked : '',
                ].join(' ')}
                onClick={() => onOpen(item)}
              >
                {isProtected ? (
                  <span
                    className={[
                      s.lockBadgeFloating,
                      isActuallyLocked ? s.locked : '',
                      isActuallyUnlocked ? s.unlocked : '',
                    ].join(' ')}
                    aria-label={
                      isActuallyLocked
                        ? 'Acceso bloqueado'
                        : 'Acceso desbloqueado'
                    }
                    title={
                      isActuallyLocked
                        ? 'Acceso bloqueado'
                        : 'Acceso desbloqueado'
                    }
                  >
                    <span
                      className={`${s.miniLockSwap} ${
                        isActuallyUnlocked ? s.miniLockSwapOpen : ''
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