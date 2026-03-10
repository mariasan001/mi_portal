import type { SesionMe } from '../types/me.types';

export type AuthMode = 'admin' | 'user';

export type Home = '/admin' | '/usuario' | '/login';

type ResolveOutput = {
  home: Home;
  path: string;
  mode?: AuthMode; // opcional: no existe si manda a /login
};


function safeTrim(v: string | null | undefined) {
  return (v ?? '').trim();
}

function hasRole(roles: string[] | undefined, role: string) {
  return Array.isArray(roles) && roles.includes(role);
}


/**
 * ✅ Reglas por appCode (aquí metes todas tus apps)
 * IMPORTANTE:
 * - Esto regresa el "home" (admin/usuario) y el modo.
 * - No decide "returnTo" todavía.
 */
function resolveHomeByAppCode(appCode: string, roles: string[]): { home: Home; mode?: AuthMode } {
  // EJ: PLAT_SERV
  if (appCode === 'PLAT_SERV') {
    const isAdmin = hasRole(roles, 'ROLE_ADMIN') || hasRole(roles, 'ROLE_SP_ADMIN');
    const isUser = hasRole(roles, 'ROLE_SP_USER') || hasRole(roles, 'ROLE_USER');

    if (isAdmin) return { home: '/admin', mode: 'admin' };
    if (isUser) return { home: '/usuario', mode: 'user' };

    return { home: '/login' };
  }

  // EJ: VENTANILLA (ejemplo tuyo)
  if (appCode === 'VENTANILLA') {
    const isAdmin = hasRole(roles, 'ROLE_ADMIN');
    if (isAdmin) return { home: '/admin', mode: 'admin' };
    return { home: '/usuario', mode: 'user' };
  }

  // Fallback si no reconocemos appCode
  return { home: '/usuario', mode: 'user' };
}

/**
 * ✅ Sanitiza y limita returnTo según el "home"
 */
function resolveAllowedReturnTo(home: Home, returnTo?: string | null) {
  const rt = safeTrim(returnTo) || home;

  // Normaliza: solo paths internos
  if (!rt.startsWith('/')) return home;

  // USER: solo /usuario/...
  if (home === '/usuario') {
    if (rt.startsWith('/usuario')) return rt;
    return '/usuario';
  }

  // ADMIN: solo /admin/...
  if (home === '/admin') {
    if (rt.startsWith('/admin')) return rt;
    return '/admin';
  }

  return '/login';
}

/**
 * ✅ Función ÚNICA para resolver destino post-login
 * - Si no hay sesión => /login
 * - Decide home con appCode + roles
 * - Respeta returnTo solo si es permitido
 */
export function resolveAuthDestination(args: {
  sesion: SesionMe | null;
  appCode: string | null;
  returnTo?: string | null;
}): ResolveOutput {
  const { sesion, appCode, returnTo } = args;

  if (!sesion?.userId) return { home: '/login', path: '/login' };

  const code = safeTrim(appCode);
  const roles = sesion.roles ?? [];

  // Si no hay appCode guardado, usa fallback más seguro
  if (!code) {
    const fallbackHome: Home = hasRole(roles, 'ROLE_ADMIN') || hasRole(roles, 'ROLE_SP_ADMIN') ? '/admin' : '/usuario';
    const path = resolveAllowedReturnTo(fallbackHome, returnTo);
    return { home: fallbackHome, path, mode: fallbackHome === '/admin' ? 'admin' : 'user' };
  }

  const { home, mode } = resolveHomeByAppCode(code, roles);

  if (home === '/login') return { home: '/login', path: '/login' };

  const path = resolveAllowedReturnTo(home, returnTo);
  return { home, path, mode };
}