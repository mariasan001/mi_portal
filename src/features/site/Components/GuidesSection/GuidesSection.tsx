// src/features/site/Components/GuidesSection/GuidesSection.tsx
'use client';

import s from './GuidesSection.module.css';
import { FiSearch, FiTrendingUp, FiRefreshCw, FiFolder, FiX } from 'react-icons/fi';

import { GUIDES_DOCS } from './constants/guides.data';
import { useGuides } from './hooks/useGuides';

import RowItem from './components/RowItem';
import SectionBox from './components/SectionBox';

export default function GuidesSection() {
  const {
    query,
    setQuery,
    openPanel,
    setOpenPanel,
    hasQuery,
    results,
    topDocs,
    recentDocs,
  } = useGuides({ docs: GUIDES_DOCS });

  return (
    <section className={s.wrap} aria-label="Guías y descargas">
      <div className={s.inner}>
        <header className={s.header}>
          <div className={s.kicker}>Centro de Documentos</div>
          <h2 className={s.title}>Guías y Descargas</h2>
          <p className={s.subtitle}>
            Manuales, instructivos y formatos oficiales para realizar tus trámites.
          </p>

          <div className={s.searchRow} role="search" aria-label="Buscar documentos">
            <span className={s.searchIcon} aria-hidden="true">
              <FiSearch />
            </span>

            <input
              className={s.searchInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar guía, formato o palabra clave…"
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
        </header>

        {hasQuery ? (
          <SectionBox
            icon={<FiSearch aria-hidden="true" />}
            title="Resultados"
            subtitle={`${results.length} resultado(s) para “${query.trim()}”`}
          >
            {results.length ? (
              <div className={s.rows}>
                {results.map((doc) => (
                  <RowItem key={doc.id} doc={doc} />
                ))}
              </div>
            ) : (
              <div className={s.empty} role="status" aria-live="polite">
                <div className={s.emptyTitle}>Sin resultados</div>
                <div className={s.emptyDesc}>Prueba con otra palabra.</div>
              </div>
            )}
          </SectionBox>
        ) : (
          <div className={s.panels}>
            <div className={s.panelTabs} role="tablist" aria-label="Secciones">
              <button
                type="button"
                className={s.panelTab}
                data-active={openPanel === 'top' ? '1' : '0'}
                onClick={() => setOpenPanel('top')}
                role="tab"
                aria-selected={openPanel === 'top'}
              >
                <FiTrendingUp aria-hidden="true" />
                <span>Más consultados</span>
              </button>

              <button
                type="button"
                className={s.panelTab}
                data-active={openPanel === 'recent' ? '1' : '0'}
                onClick={() => setOpenPanel('recent')}
                role="tab"
                aria-selected={openPanel === 'recent'}
              >
                <FiRefreshCw aria-hidden="true" />
                <span>Actualizados</span>
              </button>

              <button
                type="button"
                className={s.panelTab}
                data-active={openPanel === 'all' ? '1' : '0'}
                onClick={() => setOpenPanel('all')}
                role="tab"
                aria-selected={openPanel === 'all'}
              >
                <FiFolder aria-hidden="true" />
                <span>Todos</span>
              </button>
            </div>

            {openPanel === 'top' ? (
              <SectionBox
                icon={<FiTrendingUp aria-hidden="true" />}
                title="Más consultados"
                subtitle="Documentos más utilizados"
              >
                <div className={s.rows}>
                  {topDocs.map((doc) => (
                    <RowItem key={doc.id} doc={doc} />
                  ))}
                </div>
              </SectionBox>
            ) : null}

            {openPanel === 'recent' ? (
              <SectionBox
                icon={<FiRefreshCw aria-hidden="true" />}
                title="Actualizados recientemente"
                subtitle="Cambios y vigencias recientes"
              >
                <div className={s.rows}>
                  {recentDocs.map((doc) => (
                    <RowItem key={doc.id} doc={doc} />
                  ))}
                </div>
              </SectionBox>
            ) : null}

            {openPanel === 'all' ? (
              <SectionBox
                icon={<FiFolder aria-hidden="true" />}
                title="Todos los documentos"
                subtitle="Listado completo"
              >
                <div className={s.rows}>
                  {GUIDES_DOCS.map((doc) => (
                    <RowItem key={doc.id} doc={doc} />
                  ))}
                </div>
              </SectionBox>
            ) : null}
          </div>
        )}

        <footer className={s.footerNote} aria-hidden="true">
          Tip: busca por “formato”, “manual” o “constancia”.
        </footer>
      </div>
    </section>
  );
}