import type { IconType } from 'react-icons';
import {
  FiArchive,
  FiBriefcase,
  FiFileText,
  FiFolder,
} from 'react-icons/fi';

import type { ComprobanteAccessKey } from '../types/comprobantes.types';

/**
 * Define la estructura de cada acceso disponible dentro del módulo.
 */
export type ComprobanteAccessItem = {
  key: ComprobanteAccessKey;
  title: string;
  desc: string;
  cta: string;
  icon: IconType;
};

/**
 * Catálogo principal de opciones que se muestran en la vista menú.
 */
export const COMPROBANTES_ACCESS_ITEMS: ComprobanteAccessItem[] = [
  {
    key: 'comprobante-quincenal',
    title: 'Comprobante quincenal',
    desc: 'Consulta y descarga tu comprobante quincenal en formato digital de forma rápida y segura.',
    cta: 'Ir al comprobante',
    icon: FiFileText,
  },
  {
    key: 'constancia-quincenal',
    title: 'Constancia quincenal',
    desc: 'Aquí puedes consultar y descargar tu constancia quincenal en formato digital.',
    cta: 'Ir a constancias',
    icon: FiFolder,
  },
  {
    key: 'constancia-anualizada',
    title: 'Constancia anualizada',
    desc: 'Accede a tu constancia anualizada y obtén el documento digital desde este apartado.',
    cta: 'Ir a constancia',
    icon: FiArchive,
  },
  {
    key: 'cfdi',
    title: 'Comprobantes Fiscales Digitales CFDI',
    desc: 'Descarga tus comprobantes fiscales digitales CFDI desde este módulo.',
    cta: 'Ir al CFDI',
    icon: FiBriefcase,
  },
];