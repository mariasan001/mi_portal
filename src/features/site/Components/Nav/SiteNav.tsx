'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FaFacebookF, FaXTwitter } from 'react-icons/fa6';
import css from './SiteNav.module.css';

type NavItem = { label: string; href: string };

const items: NavItem[] = [
  { label: 'Somos DGP', href: '/somos' },
  { label: 'Normativas', href: '/normativas' },
  { label: 'Consultas', href: '/consultas' },
  { label: 'Trámites', href: '/tramites' },
  { label: 'Directorio', href: '/directorio' },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [isTop, setIsTop] = useState(true);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY || 0;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const delta = y - lastY.current;

        const THRESH = 10;   
        const GLASS_AT = 8;      
        setIsTop(y < GLASS_AT);

        if (y < 20) {
          setCompact(false);
        } else if (delta > THRESH) {
          setCompact(true);
          setOpen(false);
        } else if (delta < -THRESH) {
          setCompact(false);
        }

        lastY.current = y;
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={[
        css.navWrap,
        isTop ? css.isTop : css.hasGlass,
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
            <Image
              src="/img/logo_principal.png"
              alt="Portal de Servicios"
              width={160}
              height={120}
              priority
              className={css.logoFree}
            />
          </Link>

          <div className={css.pillLinks}>
            {items.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className={css.pillLink}
                onClick={() => setOpen(false)}
              >
                {it.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Right */}
        <div className={css.rightZone}>
          <Link className={css.ctaPill} href="/login" aria-label="Iniciar sesión">
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
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      <div className={`${css.mobilePanel} ${open ? css.mobilePanelOpen : ''}`}>
        <nav className={css.mobileLinks} aria-label="Navegación móvil">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className={css.mobileLink}
              onClick={() => setOpen(false)}
            >
              {it.label}
            </Link>
          ))}

          <Link className={css.mobileCtaPill} href="/login" onClick={() => setOpen(false)}>
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
        <button className={css.overlay} aria-label="Cerrar menú" onClick={() => setOpen(false)} />
      ) : null}
    </header>
  );
}
