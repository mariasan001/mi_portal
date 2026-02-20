// src/features/site/Components/FooterSection/FooterSection.tsx
'use client';

import s from './FooterSection.module.css';
import { FiExternalLink } from 'react-icons/fi';

type LinkItem = { label: string; href: string; external?: boolean };

type Props = {
  brandTitle?: string;
  brandDesc?: string;

  col1Title?: string;
  col2Title?: string;
  col3Title?: string;

  col1Links?: LinkItem[];
  col2Links?: LinkItem[];
  col3Links?: LinkItem[];

  bottomLeft?: string;
  bottomRightLinks?: LinkItem[];
};

function FooterLinks({ items }: { items: LinkItem[] }) {
  return (
    <ul className={s.list}>
      {items.map((l) => (
        <li key={l.label}>
          <a
            className={s.link}
            href={l.href}
            target={l.external ? '_blank' : undefined}
            rel={l.external ? 'noreferrer' : undefined}
          >
            <span>{l.label}</span>
            {l.external ? (
              <span className={s.ext} aria-hidden="true">
                <FiExternalLink />
              </span>
            ) : null}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function FooterSection({
  brandTitle = 'Portal de Servicios',
  brandDesc =
    'Atención y orientación para servidoras y servidores públicos. Accesos, guías y trámites en un solo lugar.',

  col1Title = 'Portal',
  col2Title = 'Recursos',
  col3Title = 'Institucional',

  col1Links = [
    { label: 'Guías y Descargas', href: '#guias' },
    { label: 'Avisos', href: '#avisos' },
    { label: 'Accesos rápidos', href: '#accesos' },
    { label: 'Centro de ayuda', href: '#ayuda' },
  ],
  col2Links = [
    { label: 'Recuperar contraseña', href: '#recuperacion' },
    { label: 'Preguntas frecuentes', href: '#faq' },
    { label: 'Soporte técnico', href: '#soporte' },
    { label: 'Formatos', href: '#formatos' },
  ],
  col3Links = [
    { label: 'Aviso de privacidad', href: '#privacidad' },
    { label: 'Términos de uso', href: '#terminos' },
    { label: 'Transparencia', href: '#transparencia' },
    { label: 'Contacto', href: '#contacto' },
  ],

  bottomLeft = '© 2026 Gobierno del Estado de México. Dirección General de Personal',
  bottomRightLinks = [
    { label: 'Términos', href: '#terminos' },
    { label: 'Privacidad', href: '#privacidad' },
  ],
}: Props) {
  return (
    <footer className={s.wrap} aria-label="Footer del portal">
      <div className={s.card}>
        <div className={s.top}>
          {/* Brand */}
          <div className={s.brand}>
            <div className={s.brandRow}>
              <div className={s.logoWrap} aria-hidden="true">
                <img className={s.logo} src="/img/logo_principal.png" alt="" loading="lazy" />
              </div>
              <div>
                <div className={s.brandTitle}>{brandTitle}</div>
                <p className={s.brandDesc}>{brandDesc}</p>
              </div>
            </div>
          </div>

          {/* Columns */}
          <nav className={s.cols} aria-label="Enlaces del footer">
            <div className={s.col}>
              <div className={s.colTitle}>{col1Title}</div>
              <FooterLinks items={col1Links} />
            </div>

            <div className={s.col}>
              <div className={s.colTitle}>{col2Title}</div>
              <FooterLinks items={col2Links} />
            </div>

            <div className={s.col}>
              <div className={s.colTitle}>{col3Title}</div>
              <FooterLinks items={col3Links} />
            </div>
          </nav>
        </div>

        <div className={s.bottom}>
          <div className={s.bottomLeft}>{bottomLeft}</div>

          <div className={s.bottomRight} aria-label="Enlaces legales">
            {bottomRightLinks.map((l, i) => (
              <a key={l.label} className={s.bottomLink} href={l.href}>
                {l.label}
                {i < bottomRightLinks.length - 1 ? <span className={s.sep}>•</span> : null}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}