export type DocKind = 'pdf' | 'doc' | 'xls' | 'link';

export type DocCategory =
  | 'Trámites'
  | 'Nómina'
  | 'Prestaciones'
  | 'Créditos'
  | 'Constancias'
  | 'Formatos'
  | 'Tecnología';

export type DocItem = {
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

export type PanelKey = 'top' | 'recent' | 'all';