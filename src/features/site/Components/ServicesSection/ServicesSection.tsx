// src/features/site/Components/ServicesSection/ServicesSection.tsx
import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import {
  FiSearch,
  FiFileText,
  FiClipboard,
  FiBookOpen,
  FiArrowUpRight,
} from 'react-icons/fi';

import css from './ServicesSection.module.css';

type Accent = 'vino' | 'oro' | 'arena';

type CardItem = {
  title: string;
  desc: string;
  href: string;
  cta: string;
  icon: ReactNode;
  accent: Accent;
  bgImage: string;
};

type ShellVars = CSSProperties & {
  ['--flor-url']?: string;
  ['--flor-size']?: string;
  ['--flor-x']?: string;
  ['--flor-y']?: string;
  ['--flor-rot']?: string;
  ['--flor-opacity']?: string;
};

const cards: CardItem[] = [
  {
    title: 'Consultas',
    desc: 'Consulta en un solo lugar tus trámites y documentos personales de forma rápida, segura y sin complicaciones.',
    href: '/consultas',
    cta: 'Ir al centro de consultas',
    icon: <FiFileText />,
    accent: 'vino',
    bgImage: '/img/flor_1.png',
  },
  {
    title: 'Trámites',
    desc: 'Accede a los trámites oficiales disponibles. Consulta, inicia o da seguimiento con seguridad, transparencia y respaldo institucional.',
    href: '/tramites',
    cta: 'Explorar trámites',
    icon: <FiClipboard />,
    accent: 'oro',
    bgImage: '/img/flor_2.png',
  },
  {
    title: 'Normativas y Lineamientos',
    desc: 'Accede a la normativa vigente que regula trámites, procesos y derechos laborales. Encuentra lineamientos, acuerdos y disposiciones oficiales.',
    href: '/normativas',
    cta: 'Explorar normatividad',
    icon: <FiBookOpen />,
    accent: 'arena',
    bgImage: '/img/flor_3.png',
  },
];

function shellStyle(c: CardItem): ShellVars {
  const base: ShellVars = {
    ['--flor-url']: `url('${c.bgImage}')`,
    ['--flor-size']: 'clamp(80px, 10vw, 80px)',
    ['--flor-x']: '-34px',
    ['--flor-y']: '-25px',
    ['--flor-rot']: '-52deg',
    ['--flor-opacity']: '.95',
  };

  if (c.accent === 'oro') {
    return {
      ...base,
      ['--flor-rot']: '-40deg',
      ['--flor-x']: '-33px',
      ['--flor-y']: '-30px',
      ['--flor-opacity']: '.93',
    };
  }

  if (c.accent === 'arena') {
    return {
      ...base,
      ['--flor-rot']: '-40deg',
      ['--flor-x']: '-33px',
      ['--flor-y']: '-30px',
      ['--flor-opacity']: '.92',
    };
  }

  return base;
}

export default function ServicesSection() {
  return (
    <section className={css.wrap} aria-label="Gestión de información y servicios">
      <div className={css.inner}>
        <header className={css.head}>
          <h2 className={css.title}>
            <span className={css.titleAccent}>Gestión</span> de Información y Servicios
          </h2>

          <p className={css.subtitle}>
            Consulta, tramita o busca directamente lo que necesitas en nuestro portal de servicios.
          </p>

          <div className={css.searchBar} role="search" aria-label="Buscar en el portal">
            <span className={css.searchBarIcon} aria-hidden="true">
              <FiSearch />
            </span>

            <input
              className={css.searchBarInput}
              placeholder="Buscar trámite, consulta o documento…"
              aria-label="Buscar"
              inputMode="search"
              autoComplete="off"
              spellCheck={false}
            />

            <button type="button" className={css.searchBarBtn}>
              Buscar
            </button>
          </div>
        </header>

        <div className={css.grid} role="list">
          {cards.map((c) => (
            <div
              key={c.href}
              className={css.cardShell}
              data-accent={c.accent}
              style={shellStyle(c)}
              role="listitem"
              aria-label={c.title}
            >
              <article className={css.card}>
                <div className={css.iconWrap} aria-hidden="true">
                  <span className={css.icon}>{c.icon}</span>
                </div>

                <h3 className={css.cardTitle}>{c.title}</h3>
                <p className={css.cardDesc}>{c.desc}</p>

                <Link className={css.cardCta} href={c.href} aria-label={`${c.cta}: ${c.title}`}>
                  <span>{c.cta}</span>
                  <span className={css.ctaArrow} aria-hidden="true">
                    <FiArrowUpRight />
                  </span>
                </Link>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
