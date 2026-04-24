import type { NavItem, SocialLink } from './nav.types';

export const SITE_NAV_ITEMS: NavItem[] = [
  { label: 'Somos DGP', href: '/somos' },
  { label: 'Normativas', href: '/normativas' },
  { label: 'Consultas', href: '/consultas' },
  { label: 'Tramites', href: '/tramites' },
  { label: 'Directorio', href: '/directorio' },
];

export const AUTH_NAV_ITEMS: NavItem[] = [
  { label: 'Mis accesos', href: '/mis-accesos' },
  { label: 'Consultas', href: '/consultas' },
  { label: 'Tramites', href: '/tramites' },
  { label: 'Buscar proceso', href: '/buscar-proceso' },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'Facebook', href: 'https://facebook.com' },
  { label: 'X', href: 'https://x.com' },
];
