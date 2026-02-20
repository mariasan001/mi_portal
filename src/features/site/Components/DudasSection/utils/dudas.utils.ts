// src/features/site/Components/DudasSection/utils/dudas.utils.ts

import type { FaqItem } from '../types/dudas.types';

export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href.trim());
}

export function includesQ(hay: string, needle: string): boolean {
  return hay.toLowerCase().includes(needle.toLowerCase());
}

export function buildFaqSearchBag(f: FaqItem): string {
  return [
    f.q,
    f.a,
    f.category,
    (f.keywords ?? []).join(' '),
    f.guide?.label ?? '',
  ]
    .join(' ')
    .toLowerCase();
}

export function filterFaqs(args: {
  faqs: FaqItem[];
  activeCat: string;
  query: string;
  hasQuery: boolean;
}): FaqItem[] {
  const { faqs, activeCat, query, hasQuery } = args;

  const q = query.trim().toLowerCase();

  const byCat =
    activeCat === 'Más comunes'
      ? faqs
      : faqs.filter((f) => f.category === activeCat);

  const base = hasQuery ? faqs : byCat;

  if (!q) return base;

  return base.filter((f) => buildFaqSearchBag(f).includes(q));
}