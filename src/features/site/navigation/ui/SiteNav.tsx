'use client';

import Link from 'next/link';

import AuthModal from '@/features/auth/ui/AuthModal/AuthModal';

import { useSiteNavController } from '../application/useSiteNavController';
import { NavLinks } from './components/NavLinks';
import { NavLogo } from './components/NavLogo';
import { NavSocials } from './components/NavSocials';
import css from '../../Components/Nav/SiteNav.module.css';

export default function SiteNav() {
  const {
    menuOpen,
    compact,
    isAuthenticated,
    logout,
    displayName,
    navItems,
    accountHref,
    authModal,
    closeMenu,
    toggleMenu,
    handleOpenLogin,
    handleCloseAuthModal,
  } = useSiteNavController();

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
          <NavSocials className={css.leftZone} />

          <nav className={css.pillNav} aria-label="Navegacion principal">
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
                aria-label="Iniciar sesion"
                onClick={handleOpenLogin}
              >
                <span className={css.ctaPillText}>Iniciar sesion</span>
                <span className={css.ctaPillIcon} aria-hidden="true">
                  →
                </span>
              </button>
            ) : (
              <div className={css.authActions}>
                <Link href={accountHref} className={css.userPill}>
                  <span className={css.userPillText}>{displayName}</span>
                  <span className={css.userPillIcon} aria-hidden="true">
                    Cuenta
                  </span>
                </Link>

                <button type="button" className={css.logoutBtn} onClick={logout}>
                  Salir
                </button>
              </div>
            )}

            <button
              className={css.burger}
              type="button"
              aria-label={menuOpen ? 'Cerrar menu' : 'Abrir menu'}
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
          <nav className={css.mobileLinks} aria-label="Navegacion movil">
            <NavLinks items={navItems} mobile onItemClick={closeMenu} />

            {!isAuthenticated ? (
              <button
                className={css.mobileCtaPill}
                type="button"
                onClick={handleOpenLogin}
              >
                Iniciar sesion <span aria-hidden="true">→</span>
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
                  Cerrar sesion
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
            aria-label="Cerrar menu"
            onClick={closeMenu}
          />
        ) : null}
      </header>

      <AuthModal
        open={authModal.open}
        onClose={handleCloseAuthModal}
        source={authModal.source}
        returnTo={authModal.returnTo}
        appCode={authModal.appCode}
        initialView={authModal.initialView}
      />
    </>
  );
}
