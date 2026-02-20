// src/features/site/Components/DudasSection/types/dudas.types.ts

export type FaqCategory =
  | 'Más comunes'
  | 'Cuenta'
  | 'Constancias'
  | 'Nómina'
  | 'Trámites'
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