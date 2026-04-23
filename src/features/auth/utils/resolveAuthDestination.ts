import type { SesionMe } from '../types/me.types';
import { isAdminRole, normalizeRoles } from '@/lib/auth/roles';

export type AuthMode = 'admin' | 'user';
export type Home = '/admin' | '/';

type ResolveOutput = {
  home: Home;
  path: string;
  mode: AuthMode;
};

function safeTrim(v: string | null | undefined) {
  return (v ?? '').trim();
}

function resolveHomeByAppCode(
  appCode: string,
  roles: string[]
): { home: Home; mode: AuthMode } {
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

function resolveAllowedReturnTo(home: Home, returnTo?: string | null) {
  const rt = safeTrim(returnTo) || home;

  if (!rt.startsWith('/')) return home;

  if (home === '/admin') {
    return rt.startsWith('/admin') ? rt : '/admin';
  }

  return rt.startsWith('/admin') ? '/' : rt;
}

export function resolveAuthDestination(args: {
  sesion: SesionMe | null;
  appCode: string | null;
  returnTo?: string | null;
}): ResolveOutput {
  const { sesion, appCode, returnTo } = args;

  const roles = normalizeRoles(sesion?.roles);
  const code = safeTrim(appCode);

  if (!code) {
    const fallbackHome: Home = isAdminRole(roles) ? '/admin' : '/';

    return {
      home: fallbackHome,
      path: resolveAllowedReturnTo(fallbackHome, returnTo),
      mode: fallbackHome === '/admin' ? 'admin' : 'user',
    };
  }

  const { home, mode } = resolveHomeByAppCode(code, roles);

  return {
    home,
    path: resolveAllowedReturnTo(home, returnTo),
    mode,
  };
}
