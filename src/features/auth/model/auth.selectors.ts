import { isAdminRole, normalizeRoles } from '@/lib/auth/roles';

import type { AuthHome, AuthMode } from './auth.types';
import type { SesionMe } from './session.types';

type RoleLike =
  | string
  | {
      name?: string;
      authority?: string;
    };

export function getSessionRoles(sesion: SesionMe | null): readonly string[] {
  const raw = sesion?.roles as RoleLike[] | undefined;

  if (!Array.isArray(raw)) return [];

  return normalizeRoles(
    raw.map((role) => {
      if (typeof role === 'string') return role;
      return role.name ?? role.authority ?? '';
    })
  );
}

export function hasRole(roles: readonly string[], role: string): boolean {
  return roles.includes(role);
}

export function resolveAuthHome(
  appCode: string,
  roles: readonly string[]
): { home: AuthHome; mode: AuthMode } {
  if (appCode === 'PLAT_SERV') {
    if (isAdminRole(roles)) {
      return { home: '/admin', mode: 'admin' };
    }

    return { home: '/', mode: 'user' };
  }

  if (isAdminRole(roles)) {
    return { home: '/admin', mode: 'admin' };
  }

  return { home: '/', mode: 'user' };
}
