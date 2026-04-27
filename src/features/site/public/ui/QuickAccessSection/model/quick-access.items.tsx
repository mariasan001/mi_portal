import type { QuickAccessItem } from './quick-access.types';
import {
  FiActivity,
  FiAward,
  FiBriefcase,
  FiCalendar,
  FiFileText,
  FiFilm,
  FiMonitor,
  FiPercent,
  FiUser,
} from 'react-icons/fi';

export const QUICK_ACCESS_ITEMS: QuickAccessItem[] = [
  {
    title: 'Viajes Turisticos',
    desc: 'Consulta destinos y beneficios disponibles.',
    href: '/viajes',
    icon: <FiBriefcase aria-hidden="true" />,
  },
  {
    title: 'DeclaraNET',
    desc: 'Presenta tu declaracion patrimonial en linea.',
    href: '/declaranet',
    icon: <FiMonitor aria-hidden="true" />,
  },
  {
    title: 'Deportes',
    desc: 'Registra tu participacion en actividades.',
    href: '/deportes',
    icon: <FiActivity aria-hidden="true" />,
  },
  {
    title: 'Sistema de Escalafon',
    desc: 'Consulta tu proceso y resultados.',
    href: '/escalafon',
    icon: <FiAward aria-hidden="true" />,
  },
  {
    title: 'Prestaciones ISSEMYM',
    desc: 'Tramites y estado de beneficios.',
    href: '/prestaciones',
    icon: <FiUser aria-hidden="true" />,
  },
  {
    title: 'Cine Club',
    desc: 'Consulta funciones disponibles.',
    href: '/cine-club',
    icon: <FiFilm aria-hidden="true" />,
  },
  {
    title: 'Descuentos',
    desc: 'Beneficios vigentes para servidores.',
    href: '/descuentos',
    icon: <FiPercent aria-hidden="true" />,
  },
  {
    title: 'Boletos para Festivales',
    desc: 'Compra y consulta eventos culturales.',
    href: '/festivales',
    icon: <FiCalendar aria-hidden="true" />,
  },
  {
    title: 'Comprobantes de Percepciones y Deducciones',
    desc: 'Emision y consulta de comprobantes oficiales.',
    href: 'usuario/comprobantes',
    appCode: 'PLAT_SERV',
    requiresAuth: true,
    icon: <FiFileText aria-hidden="true" />,
  },
];
