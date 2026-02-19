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

type CardVars = CSSProperties & {
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
    bgImage: '/img/flor_oro.png',
  },
  {
    title: 'Normativas y Lineamientos',
    desc: 'Accede a la normativa vigente que regula trámites, procesos y derechos laborales. Encuentra lineamientos, acuerdos y disposiciones oficiales.',
    href: '/normativas',
    cta: 'Explorar normatividad',
    icon: <FiBookOpen />,
    accent: 'arena',
    bgImage: '/img/flor_arena.png',
  },
];

function cardStyle(c: CardItem): CardVars {
  // ✅ base común para evitar “una más chica”
  const base: CardVars = {
    ['--flor-url']: `url('${c.bgImage}')`,
    ['--flor-size']: '240px',     // ✅ mismo tamaño en las 3
    ['--flor-x']: '-92px',        // ✅ posición base consistente
    ['--flor-rot']: '-18deg',
    ['--flor-opacity']: '.28',    // ✅ más color (ya no se ve gris/lavada)
  };

  if (c.accent === 'vino') {
    return {
      ...base,
      ['--flor-y']: '-112px',
    };
  }

  if (c.accent === 'oro') {
    return {
      ...base,
      ['--flor-y']: '-112px',
      ['--flor-rot']: '-16deg',
      ['--flor-opacity']: '.26',
    };
  }

  // ✅ arena: subimos más para que NO caiga “debajo” del icono
  return {
    ...base,
    ['--flor-y']: '-132px',
    ['--flor-rot']: '-16deg',
    ['--flor-opacity']: '.24',
  };
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

          <div className={css.searchRow} role="search" aria-label="Buscar en el portal">
            <span className={css.searchIcon} aria-hidden="true">
              <FiSearch />
            </span>

            <input
              className={css.searchInput}
              placeholder="¿Qué necesitas hoy?"
              aria-label="Buscar"
              inputMode="search"
            />
          </div>
        </header>

        <div className={css.grid} role="list">
          {cards.map((c) => (
            <article
              key={c.href}
              className={css.card}
              data-accent={c.accent}
              style={cardStyle(c)}
              role="listitem"
              aria-label={c.title}
            >
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
          ))}
        </div>
      </div>
    </section>
  );
}
