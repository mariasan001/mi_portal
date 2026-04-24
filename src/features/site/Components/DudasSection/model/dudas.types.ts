export type FaqCategory =
  | 'Mas comunes'
  | 'Cuenta'
  | 'Constancias'
  | 'Nomina'
  | 'Tramites'
  | 'Soporte';

export type FaqItem = {
  id: string;
  q: string;
  a: string;
  category: FaqCategory;
  keywords?: string[];
  guide?: { label: string; href: string };
  eta?: string;
  docs?: string[];
};
