import type { IconType } from 'react-icons';
import {
  FiArchive,
  FiBriefcase,
  FiFileText,
  FiFolder,
} from 'react-icons/fi';

export type ComprobanteAccessItem = {
  title: string;
  desc: string;
  href: string;
  cta: string;
  icon: IconType;
};

export const COMPROBANTES_ACCESS_ITEMS: ComprobanteAccessItem[] = [
  {
    title: 'Comprobante quincenal',
    desc: 'Consulta y descarga tu comprobante quincenal en formato digital de forma rápida y segura.',
    href: '/usuario/comprobantes/quincenal',
    cta: 'Ir al comprobante',
    icon: FiFileText,
  },
  {
    title: 'Constancia quincenal',
    desc: 'Aquí puedes consultar y descargar tu constancia quincenal en formato digital.',
    href: '/usuario/comprobantes/constancia-quincenal',
    cta: 'Ir a constancias',
    icon: FiFolder,
  },
  {
    title: 'Constancia anualizada',
    desc: 'Accede a tu constancia anualizada y obtén el documento digital desde este apartado.',
    href: '/usuario/comprobantes/constancia-anualizada',
    cta: 'Ir a constancia',
    icon: FiArchive,
  },
  {
    title: 'Comprobantes Fiscales Digitales CFDI',
    desc: 'Descarga tus comprobantes fiscales digitales CFDI desde este módulo.',
    href: '/usuario/comprobantes/cfdi',
    cta: 'Ir al CFDI',
    icon: FiBriefcase,
  },
];