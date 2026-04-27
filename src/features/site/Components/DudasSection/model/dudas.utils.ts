import type { FaqItem } from './dudas.types';

export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href.trim());
}

export function includesQ(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

export function buildFaqSearchBag(faq: FaqItem): string {
  return [faq.q, faq.a, faq.category, (faq.keywords ?? []).join(' '), faq.guide?.label ?? '']
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
  const byCat = activeCat === 'Mas comunes' ? faqs : faqs.filter((faq) => faq.category === activeCat);
  const base = hasQuery ? faqs : byCat;

  if (!q) return base;

  return base.filter((faq) => buildFaqSearchBag(faq).includes(q));
}
