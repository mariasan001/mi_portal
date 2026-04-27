import { describe, expect, it } from 'vitest';

import { APP_ROUTES } from './routes';

describe('APP_ROUTES', () => {
  it('exposes the expected public and protected entry points', () => {
    expect(APP_ROUTES.home).toBe('/');
    expect(APP_ROUTES.admin.root).toBe('/admin');
    expect(APP_ROUTES.usuario.root).toBe('/usuario');
  });

  it('keeps nomina routes grouped under admin', () => {
    expect(APP_ROUTES.admin.nomina.configuracion).toBe(
      '/admin/nomina/configuracion-periodo-version'
    );
    expect(APP_ROUTES.admin.nomina.firmaElectronica).toBe(
      '/admin/nomina/firma-electronica'
    );
  });

  it('keeps comprobantes under the usuario experience', () => {
    expect(APP_ROUTES.usuario.comprobantes).toBe('/usuario/comprobantes');
  });
});
