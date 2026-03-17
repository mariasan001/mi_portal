// src/features/site/Components/ServicesSection/constants.tsx
import type { ReactNode } from 'react';
import { FiFileText, FiClipboard, FiBookOpen, FiSearch } from 'react-icons/fi';

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
    desc: 'Consulta en un solo lugar tus trámites y documentos personales de forma rápida, segura y sin complicaciones.',
    href: '/consultas',
    cta: 'Ir al centro de consultas',
    icon: <FiFileText />,
    accent: 'vino',
    bgImage: '/img/flor_1.png',
  },
  {
    title: 'Trámites',
    desc: 'Accede a los trámites oficiales disponibles. Consulta, inicia o da seguimiento con seguridad, transparencia y respaldo institucional.',
    href: '/tramites',
    cta: 'Explorar trámites',
    icon: <FiClipboard />,
    accent: 'oro',
    bgImage: '/img/flor_2.png',
  },
  {
    title: 'Normativas y Lineamientos',
    desc: 'Accede a la normativa vigente que regula trámites, procesos y derechos laborales. Encuentra lineamientos, acuerdos y disposiciones oficiales.',
    href: '/normativas',
    cta: 'Explorar normatividad',
    icon: <FiBookOpen />,
    accent: 'arena',
    bgImage: '/img/flor_3.png',
  },



];


export const SERVICE_CARDS_CONSULTAS: CardItem[] = [
  {
    title: 'Consulta de FUMP',
    desc: 'Accede a tu Formato Único de Movimientos de Personal por altas, bajas, cambios o licencias.',
    href: '/',
    cta: 'Explorar normatividad',
    icon: <FiSearch />,
    accent: 'vino',
    bgImage: '',
  },
  {
    title: 'Consulta de Recibo de Nomina',
    desc: 'Tus pagos, siempre a la mano. Consulta tus recibos cuando los necesites.',
    href: '/',
    cta: '',
    icon: <FiSearch />,
    accent: 'vino',
    bgImage: '', 
  },
  {
    title: 'Consulta de Anualizados',
    desc: 'Consulta tus ingresos y retenciones acumuladas del año, útiles para trámites fiscales o administrativos.',
    href: '/',
    cta: '',
    icon: <FiSearch />,
    accent: 'vino',
    bgImage: '', 
  },
  {
    title: 'Consulta de Desglose de Plazas',
    desc: 'Conoce a detalle las plazas que tienes asignadas: tipo, ubicación, carga horaria y más.',
    href: '/',
    cta: 'Explorar normatividad',
    icon: <FiSearch />,
    accent: 'vino',
    bgImage: '',
  },
  {
    title: 'Consulta de Puntualidad y Asistencia',
    desc: 'Lleva el control de tu tiempo. Consulta aquí tus registros de asistencia y desempeño diario.',
    href: '/',
    cta: '',
    icon: <FiSearch />,
    accent: 'vino',
    bgImage: '', 
  },
  {
    title: 'Consulta de Recibo para Jubilados',
    desc: 'Porque tu servicio merece reconocimiento continuo. Aquí puedes consultar tus pagos mensuales.',
    href: '/',
    cta: '',
    icon: <FiSearch />,
    accent: 'vino',
    bgImage: '', 
  },
  {
    title: 'Consulta de CFDI',
    desc: '¿Necesitas tu comprobante fiscal para trámites? Aquí puedes consultarlo y descargarlo por periodo.',
    href: '/',
    cta: 'Explorar normatividad',
    icon: <FiSearch />,
    accent: 'vino',
    bgImage: '',
  },

];


export const SERVICE_CARDS_TRAMITES: CardItem[] = [
  {
    title: 'Trámite de FUMP',
    desc: 'Accede a tu Formato Único de Movimientos de Personal por altas, bajas, cambios o licencias.',
    href: '/',
    cta: 'Explorar normatividad',
    icon: <FiSearch />,
    accent: 'vino',
    bgImage: '',
  },
  {
    title: 'Trámite de Recibo de Nomina',
    desc: 'Tus pagos, siempre a la mano. Consulta tus recibos cuando los necesites.',
    href: '/',
    cta: '',
    icon: <FiSearch />,
    accent: 'vino',
    bgImage: '', 
  },
  {
    title: 'Trámite de Anualizados',
    desc: 'Consulta tus ingresos y retenciones acumuladas del año, útiles para trámites fiscales o administrativos.',
    href: '/',
    cta: '',
    icon: <FiSearch />,
    accent: 'vino',
    bgImage: '', 
  },
  {
    title: 'Trámite de Desglose de Plazas',
    desc: 'Conoce a detalle las plazas que tienes asignadas: tipo, ubicación, carga horaria y más.',
    href: '/',
    cta: 'Explorar normatividad',
    icon: <FiSearch />,
    accent: 'vino',
    bgImage: '',
  },
  {
    title: 'Trámite de Puntualidad y Asistencia',
    desc: 'Lleva el control de tu tiempo. Consulta aquí tus registros de asistencia y desempeño diario.',
    href: '/',
    cta: '',
    icon: <FiSearch />,
    accent: 'vino',
    bgImage: '', 
  },
  {
    title: 'Trámite de Recibo para Jubilados',
    desc: 'Porque tu servicio merece reconocimiento continuo. Aquí puedes consultar tus pagos mensuales.',
    href: '/',
    cta: '',
    icon: <FiSearch />,
    accent: 'vino',
    bgImage: '', 
  },
  {
    title: 'Trámite de CFDI',
    desc: '¿Necesitas tu comprobante fiscal para trámites? Aquí puedes consultarlo y descargarlo por periodo.',
    href: '/',
    cta: 'Explorar normatividad',
    icon: <FiSearch />,
    accent: 'vino',
    bgImage: '',
  },

];