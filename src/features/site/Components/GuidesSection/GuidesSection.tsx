// src/features/site/Components/GuidesSection/GuidesSection.tsx
'use client';

import { useMemo, useState } from 'react';
import s from './GuidesSection.module.css';
import {
  FiSearch,
  FiDownload,
  FiExternalLink,
  FiFileText,
  FiFile,
  FiGrid,
  FiTrendingUp,
  FiRefreshCw,
  FiFolder,
  FiX,
} from 'react-icons/fi';

type DocKind = 'pdf' | 'doc' | 'xls' | 'link';

type DocCategory =
  | 'Trámites'
  | 'Nómina'
  | 'Prestaciones'
  | 'Créditos'
  | 'Constancias'
  | 'Formatos'
  | 'Tecnología';

type DocItem = {
  id: string;
  title: string;
  desc?: string;
  category: DocCategory;
  kind: DocKind;
  href: string;
  updatedAt: string; // YYYY-MM-DD
  size?: string;
  isNew?: boolean;
  isTop?: boolean;
};

type PanelKey = 'top' | 'recent' | 'all';

function isExternalUrl(href: string) {
  return /^https?:\/\//i.test(href.trim());
}

function formatDate(yyyyMmDd: string) {
  const [y, m, d] = yyyyMmDd.split('-');
  if (!y || !m || !d) return yyyyMmDd;
  return `${d}/${m}/${y}`;
}

function kindIcon(k: DocKind) {
  if (k === 'pdf') return <FiFileText aria-hidden="true" />;
  if (k === 'doc') return <FiFile aria-hidden="true" />;
  if (k === 'xls') return <FiGrid aria-hidden="true" />;
  return <FiExternalLink aria-hidden="true" />;
}

function kindLabel(k: DocKind) {
  if (k === 'pdf') return 'PDF';
  if (k === 'doc') return 'DOC';
  if (k === 'xls') return 'XLS';
  return 'LINK';
}

function RowItem({ doc }: { doc: DocItem }) {
  const external = isExternalUrl(doc.href);
  const downloadable = doc.kind !== 'link' && !external;

  const ctaLabel = downloadable ? 'Descargar' : 'Abrir';

  return (
    <article className={s.row} aria-label={`Documento: ${doc.title}`}>
      <div className={s.rowIcon} aria-hidden="true">
        {kindIcon(doc.kind)}
      </div>

      <div className={s.rowMain}>
        <div className={s.rowTitle}>{doc.title}</div>

        <div className={s.rowMeta}>
          <span className={s.rowMetaItem}>{doc.category}</span>
          <span className={s.dot}>•</span>
          <span className={s.rowMetaItem}>{formatDate(doc.updatedAt)}</span>
          <span className={s.dot}>•</span>
          <span className={s.rowMetaItem}>{kindLabel(doc.kind)}</span>
          {doc.size ? (
            <>
              <span className={s.dot}>•</span>
              <span className={s.rowMetaItem}>{doc.size}</span>
            </>
          ) : null}
        </div>

        {doc.desc ? <div className={s.rowDesc}>{doc.desc}</div> : null}
      </div>

      <div className={s.rowActions}>
        <a
          className={downloadable ? s.ctaDownload : s.ctaOpen}
          href={doc.href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noreferrer' : undefined}
          download={downloadable ? '' : undefined}
          aria-label={`${ctaLabel}: ${doc.title}`}
        >
          {downloadable ? (
            <FiDownload aria-hidden="true" />
          ) : (
            <FiExternalLink aria-hidden="true" />
          )}
          <span>{ctaLabel}</span>
        </a>
      </div>
    </article>
  );
}

function SectionBox({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={s.box}>
      <div className={s.boxHead}>
        <span className={s.boxIcon} aria-hidden="true">
          {icon}
        </span>
        <div className={s.boxText}>
          <div className={s.boxTitle}>{title}</div>
          {subtitle ? <div className={s.boxSub}>{subtitle}</div> : null}
        </div>
      </div>

      <div className={s.boxBody}>{children}</div>
    </section>
  );
}

export default function GuidesSection() {
  const [query, setQuery] = useState('');
  const [openPanel, setOpenPanel] = useState<PanelKey>('top');

  const docs: DocItem[] = useMemo(
    () => [
      {
        id: 'g1',
        title: 'Guía rápida: Recuperación de contraseña',
        desc: 'Pasos para restablecer tu acceso al portal y validar tu correo.',
        category: 'Trámites',
        kind: 'pdf',
        href: '/docs/guia-recuperacion.pdf',
        updatedAt: '2026-02-10',
        size: '1.1 MB',
        isTop: true,
        isNew: true,
      },
      {
        id: 'g2',
        title: 'Formato: Solicitud de constancia',
        desc: 'Formato oficial para iniciar el trámite de constancia.',
        category: 'Formatos',
        kind: 'doc',
        href: '/docs/formato-constancia.docx',
        updatedAt: '2026-01-25',
        size: '220 KB',
        isTop: true,
      },
      {
        id: 'g3',
        title: 'Manual: Consulta de recibos de nómina',
        desc: 'Cómo ubicar, descargar y validar tus recibos.',
        category: 'Nómina',
        kind: 'pdf',
        href: '/docs/manual-recibos-nomina.pdf',
        updatedAt: '2026-02-02',
        size: '2.4 MB',
        isNew: true,
      },
      {
        id: 'g4',
        title: 'Lineamientos de prestaciones (resumen)',
        desc: 'Puntos clave, vigencias y consideraciones.',
        category: 'Prestaciones',
        kind: 'pdf',
        href: '/docs/lineamientos-prestaciones.pdf',
        updatedAt: '2025-12-18',
        size: '980 KB',
      },
      {
        id: 'g5',
        title: 'Directorio de apoyo técnico',
        desc: 'Canales de soporte por área y horarios.',
        category: 'Tecnología',
        kind: 'link',
        href: 'https://example.com/soporte',
        updatedAt: '2026-02-15',
        isTop: true,
      },
      {
        id: 'g6',
        title: 'Checklist de documentos para crédito',
        desc: 'Plantilla para preparar tu expediente.',
        category: 'Créditos',
        kind: 'xls',
        href: '/docs/checklist-credito.xlsx',
        updatedAt: '2026-01-08',
        size: '140 KB',
      },
      {
        id: 'g7',
        title: 'Guía: Descarga de constancias',
        desc: 'Cómo generar y descargar constancias disponibles.',
        category: 'Constancias',
        kind: 'pdf',
        href: '/docs/guia-constancias.pdf',
        updatedAt: '2026-02-05',
        size: '1.6 MB',
        isTop: true,
      },
    ],
    []
  );

  const hasQuery = query.trim().length > 0;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return docs.filter((d) => {
      return (
        d.title.toLowerCase().includes(q) ||
        (d.desc ?? '').toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        kindLabel(d.kind).toLowerCase().includes(q)
      );
    });
  }, [docs, query]);

  const topDocs = useMemo(() => docs.filter((d) => d.isTop).slice(0, 6), [docs]);
  const recentDocs = useMemo(
    () => [...docs].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)).slice(0, 6),
    [docs]
  );

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
                  {docs.map((doc) => (
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
