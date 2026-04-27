export type ComprobantesView =
  | 'menu'
  | 'comprobante-quincenal'
  | 'constancia-quincenal'
  | 'constancia-anualizada'
  | 'cfdi';

export type ComprobanteAccessKey = Exclude<ComprobantesView, 'menu'>;

export type ComprobantesHeroView = ComprobanteAccessKey | 'menu';
export type ComprobantesTransitionPhase = 'idle' | 'collapsing' | 'expanded';

export type ComprobanteAccessItem = {
  key: ComprobanteAccessKey;
  title: string;
  desc: string;
  cta: string;
  icon: import('react-icons').IconType;
};

export type ComprobantesHeroCopy = {
  title: string;
  accent: string;
  subtitleStrong: string;
  subtitle: string;
};
