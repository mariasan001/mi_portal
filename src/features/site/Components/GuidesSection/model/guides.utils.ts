import type { DocKind, DocItem } from './guides.types';

export function isExternalUrl(href: string) {
  return /^https?:\/\//i.test(href.trim());
}

export function formatDate(yyyyMmDd: string) {
  const [y, m, d] = yyyyMmDd.split('-');
  if (!y || !m || !d) return yyyyMmDd;
  return `${d}/${m}/${y}`;
}

export function kindLabel(kind: DocKind) {
  if (kind === 'pdf') return 'PDF';
  if (kind === 'doc') return 'DOC';
  if (kind === 'xls') return 'XLS';
  return 'LINK';
}

export function sortByUpdatedDesc(a: DocItem, b: DocItem) {
  return a.updatedAt < b.updatedAt ? 1 : -1;
}

export function matchesQuery(doc: DocItem, queryLower: string) {
  return (
    doc.title.toLowerCase().includes(queryLower) ||
    (doc.desc ?? '').toLowerCase().includes(queryLower) ||
    doc.category.toLowerCase().includes(queryLower) ||
    kindLabel(doc.kind).toLowerCase().includes(queryLower)
  );
}
