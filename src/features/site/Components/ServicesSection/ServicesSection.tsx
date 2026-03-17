'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiArrowUpRight, FiSearch } from 'react-icons/fi';

import css from './ServicesSection.module.css';

import { SERVICE_CARDS, SERVICE_CARDS_CONSULTAS } from './constants/ServiceConstants';
import { shellStyle } from './utils/shellStyle';

import { useRevealMotion } from '@/hooks/useRevealMotion';

type AssistantAction = 'tramite' | 'consulta' | 'password' | null;
type View = 'cards' | 'consultas';

export default function ServicesSection() {
  const { ref: sectionRef, className } = useRevealMotion<HTMLElement>({
    threshold: 0.25,
    thresholdPx: 2,
  });

  const [assistantHint, setAssistantHint] = useState<string>('');
  const [view, setView] = useState<View>('cards'); // ← NUEVO

  useEffect(() => {
    const handleNavigate = (event: Event) => {
      const customEvent = event as CustomEvent<{ action: AssistantAction }>;
      const action = customEvent.detail?.action;

      if (action !== 'tramite' && action !== 'consulta') return;

      const section = document.getElementById('services-section');
      if (!section) return;

      section.scrollIntoView({ behavior: 'smooth', block: 'start' });

      if (action === 'tramite') {
        setAssistantHint('Aquí podrás realizar trámites relacionados con lo que buscas.');
      }

      if (action === 'consulta') {
        setAssistantHint('Aquí podrás consultar información y acceder al servicio adecuado.');
      }

      window.setTimeout(() => {
        setAssistantHint('');
      }, 5000);
    };

    window.addEventListener('portal-assistant:navigate', handleNavigate as EventListener);

    return () => {
      window.removeEventListener('portal-assistant:navigate', handleNavigate as EventListener);
    };
  }, []);

  return (
    <section
      id="services-section"
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

        {/* ── Vista: tarjetas principales ── */}
        {view === 'cards' && (
          <div className={css.grid} role="list">
            {SERVICE_CARDS.map((c) => (
              <div
                key={c.href}
                className={css.cardShell}
                data-accent={c.accent}
                onClick={() => setView('consultas')}
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

                  {/* Consultas → cambia vista */}
                  {c.href === '/consultas' ? (
                    <button
                      className={css.cardCta}
                      onClick={() => setView('consultas')}
                      aria-label={`${c.cta}: ${c.title}`}
                      style={{ borderStyle: 'none', backgroundColor: 'transparent'}}
                    >
                      <span>{c.cta}</span>
                      <span className={css.ctaArrow} aria-hidden="true">
                        <FiArrowUpRight />
                      </span>
                    </button>
                  ) : (
                    <Link className={css.cardCta} href={c.href} aria-label={`${c.cta}: ${c.title}`}>
                      <span>{c.cta}</span>
                      <span className={css.ctaArrow} aria-hidden="true">
                        <FiArrowUpRight />
                      </span>
                    </Link>
                  )}
                </article>
              </div>
            ))}
          </div>
        )}

        {/* ── Vista: subconsultas ── */}
        {view === 'consultas' && (
          <div>
            <button
              className={css.backBtn} 
              style={{ marginBottom: '1.5rem' }}
              onClick={() => setView('cards')}
              aria-label="Regresar a servicios"
            >
              ← Regresar
            </button>

            <div className={css.grid} role="list">
              {SERVICE_CARDS_CONSULTAS.map((c) => (
                <div
                  key={c.title}
                  className={css.cardShell}
                  data-accent={c.accent}
                  data-variant="consultas"
                  style={shellStyle(c)}
                  role="listitem"
                  aria-label={c.title}
                >
                  <article className={css.card}>
                    <div className={css.iconWrap} aria-hidden="true">
                      <span className={css.icon}>{c.icon}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginLeft: '1rem' }}>
                    <h3 className={css.cardTitle}>{c.title}</h3>
                    <p className={css.cardDesc}>{c.desc}</p>
                    </div>

                  </article>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}