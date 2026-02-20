'use client';

import Link from 'next/link';
import { FiArrowUpRight, FiSearch } from 'react-icons/fi';

import css from './ServicesSection.module.css';

import { SERVICE_CARDS } from './constants/ServiceConstants';
import { shellStyle } from './utils/shellStyle';

import { useRevealMotion } from '@/hooks/useRevealMotion';

export default function ServicesSection() {
  // ✅ FIX: desestructuramos para NO usar `motion.ref` en JSX (linter feliz)
  const { ref: sectionRef, className } = useRevealMotion<HTMLElement>({
    threshold: 0.25,
    thresholdPx: 2,
  });

  return (
    <section
      ref={sectionRef}
      className={className(css.wrap, css.isIn, css.dirDown, css.dirUp)}
      aria-label="Gestión de información y servicios"
    >
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
          {SERVICE_CARDS.map((c) => (
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