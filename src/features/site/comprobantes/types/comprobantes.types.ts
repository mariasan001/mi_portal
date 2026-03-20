/**
 * Estados posibles de la vista principal del módulo.
 */
export type ComprobantesView =
  | 'menu'
  | 'comprobante-quincenal'
  | 'constancia-quincenal'
  | 'constancia-anualizada'
  | 'cfdi';

/**
 * Llaves válidas para seleccionar una opción desde el grid.
 */
export type ComprobanteAccessKey = Exclude<ComprobantesView, 'menu'>;


export type ComprobantesHeroView = ComprobanteAccessKey | 'menu';
export type ComprobantesTransitionPhase = 'idle' | 'collapsing' | 'expanded';