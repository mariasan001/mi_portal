
type View = 'cards' | 'consultas' | 'tramites' | 'normativas';

type ValidHref = '/consultas' | '/tramites' | '/normativas';

const viewMap: Record<ValidHref, View> = {
  '/consultas': 'consultas',
  '/tramites': 'tramites',
  '/normativas': 'normativas',
};

export function getViewFromHref(href: string): View | null {
  return viewMap[href as ValidHref] ?? null;
}