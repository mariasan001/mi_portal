import type { DocKind, DocItem } from './guides.types';

export function isExternalUrl(href: string) {
  return /^https?:\/\//i.test(href.trim());
}

export function formatDate(yyyyMmDd: string) {
  const [y, m, d] = yyyyMmDd.split('-');
  if (!y || !m || !d) return yyyyMmDd;
  return `${d}/${m}/${y}`;
}

export function kindLabel(k: DocKind) {
  if (k === 'pdf') return 'PDF';
  if (k === 'doc') return 'DOC';
  if (k === 'xls') return 'XLS';
  return 'LINK';
}

export function sortByUpdatedDesc(a: DocItem, b: DocItem) {
  // string YYYY-MM-DD compara bien lexicográficamente
  return a.updatedAt < b.updatedAt ? 1 : -1;
}

export function matchesQuery(doc: DocItem, qLower: string) {
  return (
    doc.title.toLowerCase().includes(qLower) ||
    (doc.desc ?? '').toLowerCase().includes(qLower) ||
    doc.category.toLowerCase().includes(qLower) ||
    kindLabel(doc.kind).toLowerCase().includes(qLower)
  );
}