'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import css from './SiteNav.module.css';

import AuthModal from '@/features/auth/ui/AuthModal/AuthModal';
import { useAuth } from '@/features/auth/context/auth.context';

import {
  AUTH_NAV_ITEMS,
  SITE_NAV_ITEMS,
} from '@/features/site/Components/Nav/constants/nav';

import { useCompactNav } from '@/features/site/Components/Nav/hooks/useCompactNav';
import { useOverlayLock } from '@/features/site/Components/Nav/hooks/useOverlayLock';
import { useAuthModal } from '@/features/site/Components/Nav/hooks/useAuthModal';
import { useAuthModalEvent } from '@/features/site/Components/Nav/hooks/useAuthModalEvent';

import NavSocials from './ui/NavSocials/NavSocials';
import NavLogo from './ui/NavLogo/NavLogo';
import NavLinks from './ui/NavLinks/NavLinks';

export default function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();

  const { compact } = useCompactNav();
  const { isAuthenticated, logout, sesion, mode } = useAuth();

  const { authModal, openAuthModal, closeAuthModal } = useAuthModal();

  const isComprobantesSession = pathname.startsWith('/usuario/comprobantes');

  /**
   * En comprobantes el menú central debe permanecer siempre cerrado/compacto,
   * aunque la página esté arriba y aunque el usuario no haya hecho scroll.
   */
  const forceCompact = isComprobantesSession;
  const effectiveCompact = forceCompact || compact;

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  useOverlayLock(menuOpen, closeMenu);
  useAuthModalEvent({ onOpen: openAuthModal });

  const displayName = sesion?.username ?? 'Mi cuenta';

  const navItems = useMemo(() => {
    return isAuthenticated ? AUTH_NAV_ITEMS : SITE_NAV_ITEMS;
  }, [isAuthenticated]);

  const accountHref = mode === 'admin' ? '/admin' : '/';

  const handleOpenLogin = useCallback(() => {
    closeMenu();
    openAuthModal({
      source: 'nav',
      returnTo: null,
      appCode: null,
      initialView: 'login',
    });
  }, [closeMenu, openAuthModal]);

  return (
    <>
      <header
        className={[
          css.navWrap,
          effectiveCompact ? css.isCompact : '',
          isAuthenticated ? css.authenticated : '',
        ].join(' ')}
      >
        <div className={css.navInner}>
          <NavSocials className={css.leftZone} />

          <nav className={css.pillNav} aria-label="Navegación principal">
            <NavLogo />

            <div className={css.pillLinks}>
              <NavLinks
                items={navItems}
                authenticated={isAuthenticated}
                onItemClick={closeMenu}
              />
            </div>
          </nav>

          <div className={css.rightZone}>
            {!isAuthenticated ? (
              <button
                className={css.ctaPill}
                type="button"
                aria-label="Iniciar sesión"
                onClick={handleOpenLogin}
              >
                <span className={css.ctaPillText}>Iniciar sesión</span>
                <span className={css.ctaPillIcon} aria-hidden="true">
                  ↗
                </span>
              </button>
            ) : (
              <div className={css.authActions}>
                <Link href={accountHref} className={css.userPill}>
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
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
              aria-controls="site-mobile-menu"
              onClick={toggleMenu}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        <div
          id="site-mobile-menu"
          className={`${css.mobilePanel} ${menuOpen ? css.mobilePanelOpen : ''}`}
        >
          <nav className={css.mobileLinks} aria-label="Navegación móvil">
            <NavLinks
              items={navItems}
              mobile
              onItemClick={closeMenu}
            />

            {!isAuthenticated ? (
              <button
                className={css.mobileCtaPill}
                type="button"
                onClick={handleOpenLogin}
              >
                Iniciar sesión <span aria-hidden="true">↗</span>
              </button>
            ) : (
              <>
                <Link
                  className={css.mobileLink}
                  href={accountHref}
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

            <NavSocials
              className={css.mobileSocials}
              ariaLabel="Redes sociales"
            />
          </nav>
        </div>

        {menuOpen ? (
          <button
            className={`${css.overlay} ${css.overlayOpen}`}
            aria-label="Cerrar menú"
            onClick={closeMenu}
          />
        ) : null}
      </header>

      <AuthModal
        open={authModal.open}
        onClose={closeAuthModal}
        source={authModal.source}
        returnTo={authModal.returnTo}
        appCode={authModal.appCode}
        initialView={authModal.initialView}
      />
    </>
  );
}