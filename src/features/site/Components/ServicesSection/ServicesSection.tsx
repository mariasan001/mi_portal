'use client';

import { useState } from 'react';
import { FiArrowUpRight, FiSearch } from 'react-icons/fi';

import { useRevealMotion } from '@/hooks/useRevealMotion';

import {
  SERVICE_CARDS,
  SERVICE_CARDS_CONSULTAS,
  SERVICE_CARDS_TRAMITES,
} from './constants/service-cards.constants';
import { useAssistantHint } from './hooks/useAssistantHint';
import css from './ServicesSection.module.css';
import { getViewFromHref } from './utils/getViewFromHref';
import { shellStyle } from './utils/shellStyle';

type View = 'cards' | 'consultas' | 'tramites' | 'normativas';

export default function ServicesSection() {
  const { ref: sectionRef, className } = useRevealMotion<HTMLElement>({
    threshold: 0.25,
    thresholdPx: 2,
  });

  const { assistantHint } = useAssistantHint();
  const [view, setView] = useState<View>('cards');

  const backButton = (
    <button
      style={{
        marginBottom: '1.5rem',
        width: '200px',
        borderStyle: 'none',
        backgroundColor: 'transparent',
        color: '#bc945a',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px',
      }}
      onClick={() => setView('cards')}
      aria-label="Regresar a servicios"
    >
      ← Regresar a servicios
    </button>
  );

  const renderSubCard = (card: (typeof SERVICE_CARDS_CONSULTAS)[0]) => (
    <div
      key={card.key}
      className={css.cardShell}
      data-variant="consultas"
      role="listitem"
      aria-label={card.title}
    >
      <article className={css.card}>
        <div className={css.iconWrap} aria-hidden="true">
          <span className={css.icon}>{card.icon}</span>
        </div>
        <div className={css.cardContent}>
          <h3 className={css.cardTitle}>{card.title}</h3>
          <p className={css.cardDesc}>{card.desc}</p>
        </div>
      </article>
    </div>
  );

  return (
    <section
      id="services-section"
      ref={sectionRef}
      className={className(css.wrap, css.isIn, css.dirDown, css.dirUp)}
      aria-label="Gestion de informacion y servicios"
    >
      <div className={css.inner}>
        <header className={css.head}>
          <h2 className={css.title}>
            <span className={css.titleAccent}>Gestion</span> de Informacion y Servicios
          </h2>

          <p className={css.subtitle}>
            Consulta, tramita o busca directamente lo que necesitas en nuestro portal de servicios.
          </p>

          {assistantHint ? (
            <div className={css.assistantHint} role="status" aria-live="polite">
              {assistantHint}
            </div>
          ) : null}

          <div className={css.searchBar} role="search" aria-label="Buscar en el portal">
            <span className={css.searchBarIcon} aria-hidden="true">
              <FiSearch />
            </span>

            <input
              className={css.searchBarInput}
              placeholder="Buscar tramite, consulta o documento..."
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

        {view === 'cards' && (
          <div className={css.grid} role="list">
            {SERVICE_CARDS.map((card) => (
              <div
                key={card.href}
                className={css.cardShell}
                data-accent={card.accent}
                style={{ ...shellStyle(card), cursor: 'pointer' }}
                role="listitem"
                aria-label={card.title}
                onClick={() => {
                  const nextView = getViewFromHref(card.href);
                  if (nextView) setView(nextView);
                }}
              >
                <article className={css.card}>
                  <div className={css.iconWrap} aria-hidden="true">
                    <span className={css.icon}>{card.icon}</span>
                  </div>

                  <h3 className={css.cardTitle}>{card.title}</h3>
                  <p className={css.cardDesc}>{card.desc}</p>

                  <button
                    className={css.cardCta}
                    aria-label={`${card.cta}: ${card.title}`}
                    style={{ borderStyle: 'none', backgroundColor: 'transparent' }}
                  >
                    <span>{card.cta}</span>
                    <span className={css.ctaArrow} aria-hidden="true">
                      <FiArrowUpRight />
                    </span>
                  </button>
                </article>
              </div>
            ))}
          </div>
        )}

        {view === 'consultas' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {backButton}
            <div className={css.grid} role="list">
              {SERVICE_CARDS_CONSULTAS.map(renderSubCard)}
            </div>
          </div>
        )}

        {view === 'tramites' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {backButton}
            <div className={css.grid} role="list">
              {SERVICE_CARDS_TRAMITES.map(renderSubCard)}
            </div>
          </div>
        )}

        {view === 'normativas' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {backButton}
            <div className={css.grid} role="list" />
          </div>
        )}
      </div>
    </section>
  );
}
