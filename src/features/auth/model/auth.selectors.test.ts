import { describe, expect, it } from 'vitest';

import type { SesionMe } from './session.types';
import { getSessionRoles, hasRole, resolveAuthHome } from './auth.selectors';

describe('auth.selectors', () => {
  it('normalizes session roles from strings and role objects', () => {
    const session = {
      userId: 10,
      username: 'maria',
      email: 'maria@example.com',
      spid: null,
      status: 'ACTIVE',
      roles: [
        'ROLE_ADMIN',
        { name: 'ROLE_SP_ADMIN' },
        { authority: 'ROLE_ADMIN_PLAT_SERV' },
      ],
    } as unknown as SesionMe;

    expect(getSessionRoles(session)).toEqual([
      'ROLE_ADMIN',
      'ROLE_SP_ADMIN',
      'ROLE_ADMIN_PLAT_SERV',
    ]);
  });

  it('returns false when a role is missing', () => {
    expect(hasRole(['ROLE_USER'], 'ROLE_ADMIN')).toBe(false);
  });

  it('resolves admin home for platform service admins', () => {
    expect(resolveAuthHome('PLAT_SERV', ['ROLE_ADMIN'])).toEqual({
      home: '/admin',
      mode: 'admin',
    });
  });

  it('resolves user home for non-admin users', () => {
    expect(resolveAuthHome('PLAT_SERV', ['ROLE_USER'])).toEqual({
      home: '/',
      mode: 'user',
    });
  });
});
