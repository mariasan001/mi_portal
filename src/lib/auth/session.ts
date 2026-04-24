import type { NextRequest } from 'next/server';

export const SESSION_COOKIE_NAMES = [
  'iam_session',
  'JSESSIONID',
  'SESSION',
  'sid',
] as const;

function parseCookieHeader(cookieHeader: string): Map<string, string> {
  const entries = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const eqIndex = part.indexOf('=');

      if (eqIndex === -1) {
        return [part, ''] as const;
      }

      return [
        part.slice(0, eqIndex).trim(),
        part.slice(eqIndex + 1).trim(),
      ] as const;
    });

  return new Map(entries);
}

export function hasSessionCookieHeader(cookieHeader: string): boolean {
  if (!cookieHeader.trim()) {
    return false;
  }

  const cookies = parseCookieHeader(cookieHeader);

  if (cookies.size === 0) {
    return false;
  }

  const hasKnownSessionCookie = SESSION_COOKIE_NAMES.some((name) => {
    const value = cookies.get(name);
    return typeof value === 'string' && value.length > 0;
  });

  // Algunas conexiones usan nombres de cookie distintos segun el backend.
  // Si ya existe cualquier cookie, dejamos que la validacion real ocurra
  // contra /auth/me en servidor en lugar de rechazarla prematuramente.
  return hasKnownSessionCookie || cookies.size > 0;
}

export function hasSessionCookie(req: NextRequest): boolean {
  if (req.cookies.getAll().length === 0) {
    return false;
  }

  return (
    SESSION_COOKIE_NAMES.some((name) => Boolean(req.cookies.get(name)?.value)) ||
    req.cookies.getAll().length > 0
  );
}
