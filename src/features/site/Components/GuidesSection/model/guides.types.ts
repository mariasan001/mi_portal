export type DocKind = 'pdf' | 'doc' | 'xls' | 'link';

export type DocCategory =
  | 'Tramites'
  | 'Nomina'
  | 'Prestaciones'
  | 'Creditos'
  | 'Constancias'
  | 'Formatos'
  | 'Tecnologia';

export type DocItem = {
  id: string;
  title: string;
  desc?: string;
  category: DocCategory;
  kind: DocKind;
  href: string;
  updatedAt: string;
  size?: string;
  isNew?: boolean;
  isTop?: boolean;
};

export type PanelKey = 'top' | 'recent' | 'all';
