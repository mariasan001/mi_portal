// src/features/site/Components/DudasSection/DudasSection.tsx
'use client';

import { useMemo, useState } from 'react';
import s from './DudasSection.module.css';

import {
  FiSearch,
  FiChevronDown,
  FiClock,
  FiFileText,
  FiExternalLink,
  FiX,
  FiHelpCircle,
} from 'react-icons/fi';

import { DUDAS_CATS, DUDAS_FAQS } from './constants/dudas.constants';
import type { FaqCategory } from './types/dudas.types';
import { filterFaqs, isExternalHref } from './utils/dudas.utils';
import { useRevealMotion } from '@/hooks/useRevealMotion';

// ✅ animación re-trigger (tu hook ya actualizado)

export default function DudasSection() {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<FaqCategory>('Más comunes');
  const [openId, setOpenId] = useState<string | null>(null);

  const hasQuery = query.trim().length > 0;

  const faqs = useMemo(() => DUDAS_FAQS, []);

  const filtered = useMemo(
    () =>
      filterFaqs({
        faqs,
        activeCat,
        query,
        hasQuery,
      }),
    [faqs, activeCat, query, hasQuery]
  );

  const subtitle = hasQuery
    ? `${filtered.length} resultado(s) para “${query.trim()}”`
    : 'Busca por palabra clave o explora por categoría.';

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const { ref: sectionRef, className } = useRevealMotion<HTMLElement>({
    threshold: 0.25,
    thresholdPx: 2,
  });

  return (
    <section
      ref={sectionRef}
      className={className(s.wrap, s.isIn, s.dirDown, s.dirUp)}
      aria-label="Resuelve tus dudas"
    >
      <div className={s.inner}>
        <header className={s.header}>
          <div className={s.kicker}>Ayuda</div>
          <h2 className={s.title}>Resuelve tus dudas</h2>
          <p className={s.subtitle}>
            Preguntas frecuentes sobre procesos, manuales y descargas del portal.
          </p>

          <div className={s.searchRow} role="search" aria-label="Buscar dudas">
            <span className={s.searchIcon} aria-hidden="true">
              <FiSearch />
            </span>

            <input
              className={s.searchInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca por palabra clave… (ej. contraseña, constancia, recibo)"
              aria-label="Buscar"
              inputMode="search"
              autoComplete="off"
              spellCheck={false}
            />

            {hasQuery ? (
              <button
                type="button"
                className={s.clearBtn}
                onClick={() => setQuery('')}
                aria-label="Limpiar búsqueda"
              >
                <FiX aria-hidden="true" />
              </button>
            ) : (
              <span className={s.clearBtnGhost} aria-hidden="true" />
            )}
          </div>

          <div className={s.helperLine} aria-hidden="true">
            <span className={s.helperDot} />
            <span className={s.helperText}>{subtitle}</span>
          </div>

          <div className={s.chips} role="tablist" aria-label="Categorías">
            {DUDAS_CATS.map((c) => (
              <button
                key={c}
                type="button"
                className={s.chip}
                data-active={activeCat === c ? '1' : '0'}
                onClick={() => setActiveCat(c)}
                role="tab"
                aria-selected={activeCat === c}
              >
                {c}
              </button>
            ))}
          </div>
        </header>

        <div className={s.list} role="list" aria-label="Lista de preguntas">
          {filtered.length ? (
            filtered.map((f) => {
              const isOpen = openId === f.id;
              const guideIsExternal = !!f.guide?.href && isExternalHref(f.guide.href);

              return (
                <article key={f.id} className={s.item} role="listitem">
                  <button
                    type="button"
                    className={s.qRow}
                    onClick={() => toggle(f.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${f.id}`}
                  >
                    <span className={s.qIcon} aria-hidden="true">
                      <FiHelpCircle />
                    </span>

                    <span className={s.qText}>
                      <span className={s.qTitle}>{f.q}</span>
                      <span className={s.qMeta}>{f.category}</span>
                    </span>

                    <span className={s.chev} data-open={isOpen ? '1' : '0'} aria-hidden="true">
                      <FiChevronDown />
                    </span>
                  </button>

                  <div id={`faq-${f.id}`} className={s.aWrap} data-open={isOpen ? '1' : '0'}>
                    <p className={s.answer}>{f.a}</p>

                    <div className={s.extra}>
                      {f.guide ? (
                        <a
                          className={s.guideLink}
                          href={f.guide.href}
                          target={guideIsExternal ? '_blank' : undefined}
                          rel={guideIsExternal ? 'noreferrer' : undefined}
                          aria-label={`Abrir guía: ${f.guide.label}`}
                        >
                          <FiFileText aria-hidden="true" />
                          <span>{f.guide.label}</span>
                          <FiExternalLink aria-hidden="true" />
                        </a>
                      ) : null}

                      <div className={s.metaGrid}>
                        {f.eta ? (
                          <div className={s.metaCard}>
                            <span className={s.metaIcon} aria-hidden="true">
                              <FiClock />
                            </span>
                            <div className={s.metaText}>
                              <div className={s.metaLabel}>Tiempo estimado</div>
                              <div className={s.metaValue}>{f.eta}</div>
                            </div>
                          </div>
                        ) : null}

                        {f.docs?.length ? (
                          <div className={s.metaCard}>
                            <span className={s.metaIcon} aria-hidden="true">
                              <FiFileText />
                            </span>
                            <div className={s.metaText}>
                              <div className={s.metaLabel}>Documentos / Requisitos</div>
                              <div className={s.metaValue}>{f.docs.join(' · ')}</div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className={s.empty} role="status" aria-live="polite">
              <div className={s.emptyTitle}>Sin resultados</div>
              <div className={s.emptyDesc}>
                Prueba con otra palabra (ej. “token”, “descarga”, “PDF”) o revisa una categoría.
              </div>
            </div>
          )}
        </div>

        <footer className={s.footerNote} aria-hidden="true">
          Tip: escribe “contraseña”, “constancia” o “recibo”.
        </footer>
      </div>
    </section>
  );
}