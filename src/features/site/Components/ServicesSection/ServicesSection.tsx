'use client';
/**
 *  NO USAS LINK 
 */
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiArrowUpRight, FiSearch } from 'react-icons/fi';

import css from './ServicesSection.module.css';
/**
 * SERVICE_CARDS_CONSULTAS y SERVICE_CARDS_TRAMITES están súper repetidas. Cambia solo el prefijo del título. Eso se puede generar desde una sola fuente base.
 */
import {
  SERVICE_CARDS,
  SERVICE_CARDS_CONSULTAS,
  SERVICE_CARDS_TRAMITES,
} from './constants/ServiceConstants';
import { shellStyle } from './utils/shellStyle';

import { useRevealMotion } from '@/hooks/useRevealMotion';

type AssistantAction = 'tramite' | 'consulta' | 'password' | null;
type View = 'cards' | 'consultas' | 'tramites' | 'normativas';

/**
 * Ahorita es Record<string, View>, pero realmente solo depende de ciertos href. Mejor dejarlo tipado con los paths válidos.
 */
const viewMap: Record<string, View> = {
  '/consultas': 'consultas',
  '/tramites': 'tramites',
  '/normativas': 'normativas',
};

/*


Ahorita ServicesSection hace todo:
controla vistas
escucha eventos globales
arma mensajes del asistente
renderiza cards principales
renderiza subcards
construye botón de regreso

Aquí conviene separar:

 - constants
 - utils
 - hooks


*/

/**
 * . useEffect con timeout sin cleanup
    Estás lanzando window.setTimeout pero no limpias timeout anterior. 
    Si el evento se dispara varias veces, se te pueden encimar. ESTE ES MIO JAJA PERO IGUAL AYUDAME A SOLUCIONARLO 
    

 */


export default function ServicesSection() {
  const { ref: sectionRef, className } = useRevealMotion<HTMLElement>({
    threshold: 0.25,
    thresholdPx: 2,
  });

  const [assistantHint, setAssistantHint] = useState<string>('');
  const [view, setView] = useState<View>('cards');

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

  // ── Botón regresar reutilizable ──
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
/**
 * 
 mejor usar CardItem. Así sirve para consultas, trámites y normativas sin andar jugando al favoritismo.
 
 */
  // ── Card secundaria reutilizable ──
  const renderSubCard = (c: (typeof SERVICE_CARDS_CONSULTAS)[0]) => (
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
        <div className={css.cardContent}>
          <h3 className={css.cardTitle}>{c.title}</h3>
          <p className={css.cardDesc}>{c.desc}</p>
        </div>
      </article>
    </div>
  );

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
                style={{ ...shellStyle(c), cursor: 'pointer' }}
                role="listitem"
                aria-label={c.title}
                onClick={() => {
                  const next = viewMap[c.href];
                  if (next) setView(next);
                }}


              >
                <article className={css.card}>
                  <div className={css.iconWrap} aria-hidden="true">
                    <span className={css.icon}>{c.icon}</span>
                  </div>

                  <h3 className={css.cardTitle}>{c.title}</h3>
                  <p className={css.cardDesc}>{c.desc}</p>

                  <button
                    className={css.cardCta}
                    aria-label={`${c.cta}: ${c.title}`}
                    style={{ borderStyle: 'none', backgroundColor: 'transparent' }}
                  >
                    <span>{c.cta}</span>
                    <span className={css.ctaArrow} aria-hidden="true">
                      <FiArrowUpRight />
                    </span>
                  </button>
                </article>
              </div>
            ))}
          </div>
        )}

        {/* ── Vista: consultas ── */}
        {view === 'consultas' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {backButton}
            <div className={css.grid} role="list">
              {SERVICE_CARDS_CONSULTAS.map(renderSubCard)}
            </div>
          </div>
        )}

        {/* ── Vista: trámites ── */}
        {view === 'tramites' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {backButton}
            <div className={css.grid} role="list">
              {SERVICE_CARDS_TRAMITES.map(renderSubCard)}
            </div>
          </div>
        )}

        {/* ── Vista: normativas */}
        {view === 'normativas' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {backButton}
            <div className={css.grid} role="list">
               
            </div>
          </div>
        )}

      </div>
    </section>
  );
}