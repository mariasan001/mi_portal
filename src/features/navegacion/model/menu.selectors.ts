import type { MenuItem } from './menu.types';

export function isActiveRoute(pathname: string, route: string): boolean {
  const cleanRoute = route.trim();

  if (!cleanRoute) return false;
  if (cleanRoute === '/') return pathname === '/';

  return pathname === cleanRoute || pathname.startsWith(`${cleanRoute}/`);
}

export function itemMatchesPath(item: MenuItem, pathname: string): boolean {
  const selfMatches = item.route ? isActiveRoute(pathname, item.route) : false;
  if (selfMatches) return true;

  for (const child of item.children ?? []) {
    if (itemMatchesPath(child, pathname)) return true;
  }

  return false;
}

export function safeHref(route?: string): string {
  const cleanRoute = (route ?? '').trim();
  return cleanRoute || '#';
}

export function unwrapRootMenuItems(items: MenuItem[]): MenuItem[] {
  const maybeRoot = items[0];

  const isRootWrapper =
    items.length === 1 &&
    Boolean(maybeRoot) &&
    (maybeRoot.route ?? '').trim() === '/' &&
    (maybeRoot.children?.length ?? 0) > 0;

  return isRootWrapper ? (maybeRoot.children ?? []) : items;
}
