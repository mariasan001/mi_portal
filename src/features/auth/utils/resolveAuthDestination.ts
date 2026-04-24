import { isAdminRole, normalizeRoles } from '@/lib/auth/roles';

import { DEFAULT_AUTH_APP_CODE } from '../model/auth.constants';
import { resolveAuthHome } from '../model/auth.selectors';
import type { AuthHome as Home, AuthMode } from '../model/auth.types';
import type { SesionMe } from '../model/session.types';
import { safeTrim } from './authInput';

type ResolveOutput = {
  home: Home;
  path: string;
  mode: AuthMode;
};

function resolveAllowedReturnTo(home: Home, returnTo?: string | null) {
  const nextPath = safeTrim(returnTo) || home;

  if (!nextPath.startsWith('/')) return home;

  if (home === '/admin') {
    return nextPath.startsWith('/admin') ? nextPath : '/admin';
  }

  return nextPath.startsWith('/admin') ? '/' : nextPath;
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

  const { home, mode } = resolveAuthHome(code || DEFAULT_AUTH_APP_CODE, roles);

  return {
    home,
    path: resolveAllowedReturnTo(home, returnTo),
    mode,
  };
}
