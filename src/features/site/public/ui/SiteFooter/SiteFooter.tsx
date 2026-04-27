'use client';

import Image from 'next/image';
import { FiExternalLink } from 'react-icons/fi';

import s from './SiteFooter.module.css';

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
      {items.map((item) => (
        <li key={item.label}>
          <a
            className={s.link}
            href={item.href}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noreferrer' : undefined}
          >
            <span>{item.label}</span>
            {item.external ? (
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

export default function SiteFooter({
  brandTitle = 'Portal de Servicios',
  brandDesc =
    'Atencion y orientacion para servidoras y servidores publicos. Accesos, guias y tramites en un solo lugar.',
  col1Title = 'Portal',
  col2Title = 'Recursos',
  col3Title = 'Institucional',
  col1Links = [
    { label: 'Guias y Descargas', href: '#guias' },
    { label: 'Avisos', href: '#avisos' },
    { label: 'Accesos rapidos', href: '#accesos' },
    { label: 'Centro de ayuda', href: '#ayuda' },
  ],
  col2Links = [
    { label: 'Recuperar contrasena', href: '#recuperacion' },
    { label: 'Preguntas frecuentes', href: '#faq' },
    { label: 'Soporte tecnico', href: '#soporte' },
    { label: 'Formatos', href: '#formatos' },
  ],
  col3Links = [
    { label: 'Aviso de privacidad', href: '#privacidad' },
    { label: 'Terminos de uso', href: '#terminos' },
    { label: 'Transparencia', href: '#transparencia' },
    { label: 'Contacto', href: '#contacto' },
  ],
  bottomLeft = '(c) 2026 Gobierno del Estado de Mexico. Direccion General de Personal',
  bottomRightLinks = [
    { label: 'Terminos', href: '#terminos' },
    { label: 'Privacidad', href: '#privacidad' },
  ],
}: Props) {
  return (
    <footer className={s.wrap} aria-label="Footer del portal">
      <div className={s.card}>
        <div className={s.top}>
          <div className={s.brand}>
            <div className={s.brandRow}>
              <div className={s.logoWrap} aria-hidden="true">
                <Image
                  className={s.logo}
                  src="/img/logo_principal.png"
                  alt=""
                  width={30}
                  height={30}
                  loading="lazy"
                />
              </div>
              <div>
                <div className={s.brandTitle}>{brandTitle}</div>
                <p className={s.brandDesc}>{brandDesc}</p>
              </div>
            </div>
          </div>

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
            {bottomRightLinks.map((item, index) => (
              <a key={item.label} className={s.bottomLink} href={item.href}>
                {item.label}
                {index < bottomRightLinks.length - 1 ? (
                  <span className={s.sep}>•</span>
                ) : null}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
