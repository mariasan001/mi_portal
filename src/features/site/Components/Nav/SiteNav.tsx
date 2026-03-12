'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';
import { FaFacebookF, FaXTwitter } from 'react-icons/fa6';

import css from './SiteNav.module.css';
import {
  SITE_NAV_ITEMS,
  AUTH_NAV_ITEMS,
} from '@/features/site/Components/Nav/constants/nav';
import { useCompactNav } from '@/features/site/Components/Nav/hooks/useCompactNav';
import { useOverlayLock } from '@/features/site/Components/Nav/hooks/useOverlayLock';

import AuthModal from '@/features/auth/ui/AuthModal/AuthModal';
import { useAuth } from '@/features/auth/context/auth.context';

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const { compact } = useCompactNav();
  const { isAuthenticated, logout, sesion, mode } = useAuth();

  const closeMenu = useCallback(() => setOpen(false), []);
  useOverlayLock(open, closeMenu);

  const displayName = sesion?.username ?? 'Mi cuenta';

  const activeNavItems = useMemo(
    () => (isAuthenticated ? AUTH_NAV_ITEMS : SITE_NAV_ITEMS),
    [isAuthenticated]
  );

  return (
    <>
      <header
        className={[
          css.navWrap,
          compact ? css.isCompact : '',
          isAuthenticated ? css.authenticated : '',
        ].join(' ')}
      >
        <div className={css.navInner}>
          <div className={css.leftZone} aria-label="Redes sociales">
            <a
              className={css.socialIcon}
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              title="Facebook"
            >
              <FaFacebookF />
            </a>

            <a
              className={css.socialIcon}
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
              title="X"
            >
              <FaXTwitter />
            </a>
          </div>

          <nav className={css.pillNav} aria-label="Navegación principal">
            <Link href="/" className={css.pillLogoFree} aria-label="Inicio">
              <span className={css.logoFullWrap} aria-hidden="true">
                <Image
                  src="/img/logo_principal.png"
                  alt=""
                  width={180}
                  height={72}
                  priority
                  className={`${css.logoFull} ${css.fullNormal}`}
                />
                <Image
                  src="/img/logo_gob.png"
                  alt=""
                  width={180}
                  height={72}
                  priority
                  className={`${css.logoFull} ${css.fullVeda}`}
                />
              </span>

              <span className={css.logoChip} aria-hidden="true">
                <Image
                  src="/img/colibri.png"
                  alt=""
                  width={64}
                  height={64}
                  priority
                  className={`${css.logoIcon} ${css.compactNormal}`}
                />
                <Image
                  src="/img/escudo.png"
                  alt=""
                  width={64}
                  height={64}
                  priority
                  className={`${css.logoIcon} ${css.compactVeda}`}
                />
              </span>
            </Link>

            <div className={css.pillLinks}>
              {activeNavItems.map((it, index) => (
                <Link
                  key={it.href}
                  href={it.href}
                  className={`${css.pillLink} ${isAuthenticated ? css.authPillLink : ''}`}
                  onClick={closeMenu}
                  style={isAuthenticated ? { animationDelay: `${index * 55}ms` } : undefined}
                >
                  {it.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className={css.rightZone}>
            {!isAuthenticated ? (
              <button
                className={css.ctaPill}
                type="button"
                aria-label="Iniciar sesión"
                onClick={() => {
                  closeMenu();
                  setLoginOpen(true);
                }}
              >
                <span className={css.ctaPillText}>Iniciar sesión</span>
                <span className={css.ctaPillIcon} aria-hidden="true">
                  ↗
                </span>
              </button>
            ) : (
              <div className={css.authActions}>
                <Link
                  href={mode === 'admin' ? '/admin' : '/'}
                  className={css.userPill}
                >
                  <span className={css.userPillText}>{displayName}</span>
                  <span className={css.userPillIcon} aria-hidden="true">
                    👤
                  </span>
                </Link>

                <button
                  type="button"
                  className={css.logoutBtn}
                  onClick={logout}
                >
                  Salir
                </button>
              </div>
            )}

            <button
              className={css.burger}
              type="button"
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={open}
              aria-controls="site-mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        <div
          id="site-mobile-menu"
          className={`${css.mobilePanel} ${open ? css.mobilePanelOpen : ''}`}
        >
          <nav className={css.mobileLinks} aria-label="Navegación móvil">
            {activeNavItems.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className={css.mobileLink}
                onClick={closeMenu}
              >
                {it.label}
              </Link>
            ))}

            {!isAuthenticated ? (
              <button
                className={css.mobileCtaPill}
                type="button"
                onClick={() => {
                  closeMenu();
                  setLoginOpen(true);
                }}
              >
                Iniciar sesión <span aria-hidden="true">↗</span>
              </button>
            ) : (
              <>
                <Link
                  className={css.mobileLink}
                  href={mode === 'admin' ? '/admin' : '/'}
                  onClick={closeMenu}
                >
                  Mi cuenta
                </Link>

                <button
                  type="button"
                  className={css.mobileLogoutBtn}
                  onClick={() => {
                    closeMenu();
                    logout();
                  }}
                >
                  Cerrar sesión
                </button>
              </>
            )}

            <div className={css.mobileSocials} aria-label="Redes sociales">
              <a
                className={css.socialIcon}
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                title="Facebook"
              >
                <FaFacebookF />
              </a>

              <a
                className={css.socialIcon}
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                title="X"
              >
                <FaXTwitter />
              </a>
            </div>
          </nav>
        </div>

        {open ? (
          <button
            className={`${css.overlay} ${css.overlayOpen}`}
            aria-label="Cerrar menú"
            onClick={closeMenu}
          />
        ) : null}
      </header>

      <AuthModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
      />
    </>
  );
}