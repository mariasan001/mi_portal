import {
  FiArchive,
  FiBriefcase,
  FiFileText,
  FiFolder,
} from 'react-icons/fi';

import type { ComprobanteAccessItem } from './comprobantes.types';

export const COMPROBANTES_ACCESS_ITEMS: ComprobanteAccessItem[] = [
  {
    key: 'comprobante-quincenal',
    title: 'Comprobante quincenal',
    desc: 'Consulta y descarga tu comprobante quincenal en formato digital de forma rapida y segura.',
    cta: 'Ir al comprobante',
    icon: FiFileText,
  },
  {
    key: 'constancia-quincenal',
    title: 'Constancia quincenal',
    desc: 'Aqui puedes consultar y descargar tu constancia quincenal en formato digital.',
    cta: 'Ir a constancias',
    icon: FiFolder,
  },
  {
    key: 'constancia-anualizada',
    title: 'Constancia anualizada',
    desc: 'Accede a tu constancia anualizada y obten el documento digital desde este apartado.',
    cta: 'Ir a constancia',
    icon: FiArchive,
  },
  {
    key: 'cfdi',
    title: 'Comprobantes Fiscales Digitales CFDI',
    desc: 'Descarga tus comprobantes fiscales digitales CFDI desde este modulo.',
    cta: 'Ir al CFDI',
    icon: FiBriefcase,
  },
];
