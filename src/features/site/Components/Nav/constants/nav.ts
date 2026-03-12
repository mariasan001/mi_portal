export type NavItem = { label: string; href: string };

export const SITE_NAV_ITEMS: NavItem[] = [
  { label: 'Somos DGP', href: '/somos' },
  { label: 'Normativas', href: '/normativas' },
  { label: 'Consultas', href: '/consultas' },
  { label: 'Trámites', href: '/tramites' },
  { label: 'Directorio', href: '/directorio' },
];

export const AUTH_NAV_ITEMS: NavItem[] = [
  { label: 'Mis accesos ', href: '/mis-accesos' },
  { label: 'Consultas', href: '/consultas' },
  { label: 'Trámites', href: '/tramites' },
  { label: 'Buscar proceso', href: '/buscar-proceso' },
];