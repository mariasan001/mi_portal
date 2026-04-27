import { describe, expect, it } from 'vitest';

import type { MenuItem } from './menu.types';
import {
  isActiveRoute,
  itemMatchesPath,
  safeHref,
  unwrapRootMenuItems,
} from './menu.selectors';

const nestedItem: MenuItem = {
  code: 'root',
  name: 'Root',
  route: '/admin',
  icon: 'Home',
  children: [
    {
      code: 'child',
      name: 'Child',
      route: '/admin/nomina',
      icon: 'Folder',
    },
  ],
};

describe('menu.selectors', () => {
  it('detects active routes including nested paths', () => {
    expect(isActiveRoute('/admin/nomina/carga', '/admin/nomina')).toBe(true);
    expect(isActiveRoute('/usuario/comprobantes', '/admin')).toBe(false);
  });

  it('matches nested items against the current path', () => {
    expect(itemMatchesPath(nestedItem, '/admin/nomina/carga')).toBe(true);
  });

  it('returns a safe fallback href when the route is empty', () => {
    expect(safeHref('')).toBe('#');
    expect(safeHref('/admin')).toBe('/admin');
  });

  it('unwraps a synthetic root wrapper menu', () => {
    const items = unwrapRootMenuItems([
      {
        code: 'wrapper',
        name: 'Wrapper',
        route: '/',
        icon: 'House',
        children: [nestedItem],
      },
    ]);

    expect(items).toEqual([nestedItem]);
  });
});
