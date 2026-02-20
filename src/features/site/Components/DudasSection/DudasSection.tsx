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

type FaqCategory = 'Más comunes' | 'Cuenta' | 'Constancias' | 'Nómina' | 'Trámites' | 'Soporte';

type FaqItem = {
  id: string;
  q: string;
  a: string;
  category: FaqCategory;
  keywords?: string[];
  guide?: { label: string; href: string }; // guía / manual relacionado
  eta?: string; // tiempo estimado
  docs?: string[]; // documentos
};

const CATS: FaqCategory[] = [
  'Más comunes',
  'Cuenta',
  'Constancias',
  'Nómina',
  'Trámites',
  'Soporte',
];

function includesQ(hay: string, needle: string) {
  return hay.toLowerCase().includes(needle.toLowerCase());
}

export default function DudasSection() {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<FaqCategory>('Más comunes');
  const [openId, setOpenId] = useState<string | null>(null);

  const faqs: FaqItem[] = useMemo(
    () => [
      {
        id: 'f1',
        q: '¿Qué hago si olvidé mi contraseña?',
        a: 'Usa la opción “Recuperar contraseña”. Te llegará un código al correo registrado para restablecer el acceso.',
        category: 'Más comunes',
        keywords: ['contraseña', 'recuperación', 'acceso', 'correo', 'token'],
        guide: { label: 'Guía: Recuperación de contraseña', href: '/docs/guia-recuperacion.pdf' },
        eta: '3–5 minutos',
        docs: ['Correo institucional (o registrado)'],
      },
      {
        id: 'f2',
        q: 'No me llega el correo de verificación, ¿qué hago?',
        a: 'Revisa Spam/No deseado, confirma que tu correo esté bien escrito y vuelve a solicitar el envío. Si persiste, usa “Soporte”.',
        category: 'Cuenta',
        keywords: ['correo', 'verificación', 'token', 'spam'],
        guide: { label: 'Manual: Acceso y validación de correo', href: '/docs/manual-acceso.pdf' },
        eta: '2–4 minutos',
        docs: ['Correo correcto', 'Acceso a bandeja de entrada'],
      },
      {
        id: 'f3',
        q: '¿Por qué no aparece mi constancia para descargar?',
        a: 'Puede deberse a que aún no está disponible para tu periodo o falta concluir el proceso. Verifica filtros, periodo y estatus.',
        category: 'Constancias',
        keywords: ['constancia', 'descarga', 'periodo', 'estatus'],
        guide: { label: 'Guía: Descarga de constancias', href: '/docs/guia-constancias.pdf' },
        eta: '5–10 minutos',
        docs: ['Periodo correcto', 'Datos actualizados'],
      },
      {
        id: 'f4',
        q: 'Mi PDF se descarga vacío o no abre, ¿qué hago?',
        a: 'Intenta con otro navegador, actualiza el lector PDF o vuelve a descargar. Si el archivo sigue vacío, repite el proceso de generación.',
        category: 'Constancias',
        keywords: ['pdf', 'vacío', 'descarga', 'abre'],
        guide: { label: 'Solución: Problemas con PDFs', href: '/docs/solucion-pdf.pdf' },
        eta: '3–8 minutos',
        docs: ['Navegador actualizado', 'Lector PDF'],
      },
      {
        id: 'f5',
        q: '¿Cómo descargo recibos de nómina de meses anteriores?',
        a: 'En Nómina, selecciona el periodo deseado y descarga el recibo. Si no aparece, puede ser por vigencia o disponibilidad del sistema.',
        category: 'Nómina',
        keywords: ['nómina', 'recibo', 'periodo', 'meses anteriores'],
        guide: { label: 'Manual: Consulta de recibos de nómina', href: '/docs/manual-recibos-nomina.pdf' },
        eta: '4–6 minutos',
        docs: ['Periodo/mes a consultar'],
      },
      {
        id: 'f6',
        q: '¿Puedo corregir datos después de enviar un trámite?',
        a: 'Depende del proceso. Algunos permiten corrección antes de “Enviar”, otros requieren levantar una solicitud de ajuste con soporte.',
        category: 'Trámites',
        keywords: ['corregir', 'datos', 'trámite', 'editar'],
        guide: { label: 'Guía: Correcciones y ajustes', href: '/docs/guia-ajustes.pdf' },
        eta: '5–15 minutos',
        docs: ['Identificación del trámite', 'Datos correctos'],
      },
      {
        id: 'f7',
        q: '¿Qué hago si el sistema marca error al enviar?',
        a: 'Revisa tu conexión, valida campos obligatorios y reintenta. Si continúa, guarda captura y repórtalo a soporte con fecha/hora.',
        category: 'Soporte',
        keywords: ['error', 'enviar', 'fallo', 'soporte'],
        guide: { label: 'Directorio de apoyo técnico', href: 'https://example.com/soporte' },
        eta: '2–10 minutos',
        docs: ['Captura del error', 'Hora y módulo'],
      },
    ],
    []
  );

  const hasQuery = query.trim().length > 0;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    // base por categoría (si no hay query, respeta la categoría)
    const byCat =
      activeCat === 'Más comunes'
        ? faqs
        : faqs.filter((f) => f.category === activeCat);

    // si hay query, busca dentro de TODO (no solo la categoría) para evitar “busca pero no aparece”
    const base = hasQuery ? faqs : byCat;

    if (!q) return base;

    return base.filter((f) => {
      const bag = [
        f.q,
        f.a,
        f.category,
        (f.keywords ?? []).join(' '),
        f.guide?.label ?? '',
      ].join(' ');
      return bag.toLowerCase().includes(q);
    });
  }, [faqs, activeCat, query, hasQuery]);

  const subtitle = hasQuery
    ? `${filtered.length} resultado(s) para “${query.trim()}”`
    : 'Busca por palabra clave o explora por categoría.';

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className={s.wrap} aria-label="Resuelve tus dudas">
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
            ) : null}
          </div>

          <div className={s.helperLine} aria-hidden="true">
            <span className={s.helperDot} />
            <span className={s.helperText}>{subtitle}</span>
          </div>

          <div className={s.chips} role="tablist" aria-label="Categorías">
            {CATS.map((c) => (
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
                          target={/^https?:\/\//i.test(f.guide.href) ? '_blank' : undefined}
                          rel={/^https?:\/\//i.test(f.guide.href) ? 'noreferrer' : undefined}
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
                              <div className={s.metaValue}>
                                {f.docs.join(' · ')}
                              </div>
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
