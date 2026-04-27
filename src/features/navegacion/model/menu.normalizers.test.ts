import { describe, expect, it } from 'vitest';

import { normalizarMenu } from './menu.normalizers';

describe('menu.normalizers', () => {
  it('normalizes menu items, sorts them, and removes inactive entries', () => {
    const result = normalizarMenu({
      app_code: 'PLAT_SERV',
      menu: [
        {
          id: 'reports',
          title: 'Reportes',
          path: '/admin/reportes',
          iconName: 'FileText',
          order: 2,
          active: true,
        },
        {
          key: 'config',
          label: 'Configuracion',
          href: '/admin/configuracion',
          icon: 'Settings',
          orderIndex: 1,
          active: true,
          children: [
            {
              id: 'hidden-child',
              title: 'Hidden',
              path: '/admin/configuracion/hidden',
              active: false,
            },
            {
              id: 'visible-child',
              title: 'Visible',
              path: '/admin/configuracion/visible',
              active: true,
            },
          ],
        },
        {
          id: 'inactive',
          title: 'Inactivo',
          path: '/admin/inactivo',
          active: false,
        },
      ],
    });

    expect(result.appCode).toBe('PLAT_SERV');
    expect(result.items).toHaveLength(2);
    expect(result.items.map((item) => item.code)).toEqual(['config', 'reports']);
    expect(result.items[0]?.children).toEqual([
      expect.objectContaining({ code: 'visible-child', route: '/admin/configuracion/visible' }),
    ]);
  });

  it('throws when the response does not have a valid shape', () => {
    expect(() => normalizarMenu(null)).toThrow(
      'La respuesta del menu no tiene un formato valido.'
    );
  });
});
