import React from 'react';
import s from '../GuidesSection.module.css';
import { FiDownload, FiExternalLink, FiFileText, FiFile, FiGrid } from 'react-icons/fi';

import type { DocItem, DocKind } from '../utils/guides.types';
import { formatDate, isExternalUrl, kindLabel } from '../utils/guides.utils';

function kindIcon(k: DocKind) {
  if (k === 'pdf') return <FiFileText aria-hidden="true" />;
  if (k === 'doc') return <FiFile aria-hidden="true" />;
  if (k === 'xls') return <FiGrid aria-hidden="true" />;
  return <FiExternalLink aria-hidden="true" />;
}

export default function RowItem({ doc }: { doc: DocItem }) {
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
          {downloadable ? <FiDownload aria-hidden="true" /> : <FiExternalLink aria-hidden="true" />}
          <span>{ctaLabel}</span>
        </a>
      </div>
    </article>
  );
}