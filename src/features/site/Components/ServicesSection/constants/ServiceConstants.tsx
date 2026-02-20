// src/features/site/Components/ServicesSection/constants.tsx
import type { ReactNode } from 'react';
import { FiFileText, FiClipboard, FiBookOpen } from 'react-icons/fi';

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