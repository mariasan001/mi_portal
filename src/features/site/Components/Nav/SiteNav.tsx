'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { FaFacebookF, FaXTwitter } from 'react-icons/fa6';

import css from './SiteNav.module.css';
import { SITE_NAV_ITEMS } from '@/features/site/Components/Nav/constants/nav';
import { useCompactNav } from '@/features/site/Components/Nav/hooks/useCompactNav';
import { useOverlayLock } from '@/features/site/Components/Nav/hooks/useOverlayLock';

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const { compact } = useCompactNav();

  const closeMenu = useCallback(() => setOpen(false), []);
  useOverlayLock(open, closeMenu);

  return (
    <header
      className={[
        css.navWrap,
        compact ? css.isCompact : '',
      ].join(' ')}
    >
      <div className={css.navInner}>
        {/* Left */}
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

        {/* Center */}
        <nav className={css.pillNav} aria-label="Navegación principal">
          <Link href="/" className={css.pillLogoFree} aria-label="Inicio">
            {/* ✅ NO COMPACTO: logo completo */}
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

            {/* ✅ COMPACTO: icono en círculo */}
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
            {SITE_NAV_ITEMS.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className={css.pillLink}
                onClick={closeMenu}
              >
                {it.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Right */}
        <div className={css.rightZone}>
          <Link className={css.ctaPill} href="/" aria-label="Buscar Tramite">
            <span className={css.ctaPillText}>Iniciar sesión</span>
            <span className={css.ctaPillIcon} aria-hidden="true">
              ↗
            </span>
          </Link>

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

      {/* Mobile panel */}
      <div id="site-mobile-menu" className={`${css.mobilePanel} ${open ? css.mobilePanelOpen : ''}`}>
        <nav className={css.mobileLinks} aria-label="Navegación móvil">
          {SITE_NAV_ITEMS.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className={css.mobileLink}
              onClick={closeMenu}
            >
              {it.label}
            </Link>
          ))}

          <Link className={css.mobileCtaPill} href="/login" onClick={closeMenu}>
            Iniciar sesión <span aria-hidden="true">↗</span>
          </Link>

          <div className={css.mobileSocials} aria-label="Redes sociales">
            <a className={css.socialIcon} href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" title="Facebook">
              <FaFacebookF />
            </a>
            <a className={css.socialIcon} href="https://x.com" target="_blank" rel="noreferrer" aria-label="X" title="X">
              <FaXTwitter />
            </a>
          </div>
        </nav>
      </div>

      {open ? (
        <button className={`${css.overlay} ${css.overlayOpen}`} aria-label="Cerrar menú" onClick={closeMenu} />
      ) : null}
    </header>
  );
}