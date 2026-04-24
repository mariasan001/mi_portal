import type { ReactNode } from 'react';
import { FiBookOpen, FiClipboard, FiFileText, FiSearch } from 'react-icons/fi';

export type Accent = 'vino' | 'oro' | 'arena';

export type CardItem = {
  title: string;
  desc: string;
  href: string;
  cta: string;
  icon: ReactNode;
  accent: Accent;
  bgImage: string;
};

export const SERVICE_CARDS: CardItem[] = [
  {
    title: 'Consultas',
    desc: 'Consulta en un solo lugar tus tramites y documentos personales de forma rapida, segura y sin complicaciones.',
    href: '/consultas',
    cta: 'Ir al centro de consultas',
    icon: <FiFileText />,
    accent: 'vino',
    bgImage: '/img/flor_1.png',
  },
  {
    title: 'Tramites',
    desc: 'Accede a los tramites oficiales disponibles. Consulta, inicia o da seguimiento con seguridad, transparencia y respaldo institucional.',
    href: '/tramites',
    cta: 'Explorar tramites',
    icon: <FiClipboard />,
    accent: 'oro',
    bgImage: '/img/flor_2.png',
  },
  {
    title: 'Normativas y Lineamientos',
    desc: 'Accede a la normativa vigente que regula tramites, procesos y derechos laborales. Encuentra lineamientos, acuerdos y disposiciones oficiales.',
    href: '/normativas',
    cta: 'Explorar normatividad',
    icon: <FiBookOpen />,
    accent: 'arena',
    bgImage: '/img/flor_3.png',
  },
];

type ServiceDetailSeed = {
  key: string;
  title: string;
  desc: string;
  icon?: ReactNode;
};

const ITEMS_BASE: ServiceDetailSeed[] = [
  {
    key: 'fump',
    title: 'FUMP',
    desc: 'Accede a tu Formato Unico de Movimientos de Personal por altas, bajas, cambios o licencias.',
    icon: <FiSearch />,
  },
  {
    key: 'nomina',
    title: 'Recibo de Nomina',
    desc: 'Tus pagos, siempre a la mano. Consulta tus recibos cuando los necesites.',
    icon: <FiSearch />,
  },
  {
    key: 'anualizados',
    title: 'Anualizados',
    desc: 'Consulta tus ingresos y retenciones acumuladas del ano, utiles para tramites fiscales o administrativos.',
    icon: <FiSearch />,
  },
  {
    key: 'plazas',
    title: 'Desglose de Plazas',
    desc: 'Conoce a detalle las plazas que tienes asignadas: tipo, ubicacion, carga horaria y mas.',
    icon: <FiSearch />,
  },
  {
    key: 'asistencia',
    title: 'Puntualidad y Asistencia',
    desc: 'Lleva el control de tu tiempo. Consulta aqui tus registros de asistencia y desempeno diario.',
    icon: <FiSearch />,
  },
  {
    key: 'jubilados',
    title: 'Recibo para Jubilados',
    desc: 'Porque tu servicio merece reconocimiento continuo. Aqui puedes consultar tus pagos mensuales.',
    icon: <FiSearch />,
  },
  {
    key: 'cfdi',
    title: 'CFDI',
    desc: 'Si necesitas tu comprobante fiscal para tramites, aqui puedes consultarlo y descargarlo por periodo.',
    icon: <FiSearch />,
  },
];

export const SERVICE_CARDS_CONSULTAS = ITEMS_BASE.map((item) => ({
  ...item,
  title: `Consulta de ${item.title}`,
}));

export const SERVICE_CARDS_TRAMITES = ITEMS_BASE.map((item) => ({
  ...item,
  title: `Tramite de ${item.title}`,
}));
