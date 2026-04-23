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

  return SESSION_COOKIE_NAMES.some((name) => {
    const value = cookies.get(name);
    return typeof value === 'string' && value.length > 0;
  });
}

export function hasSessionCookie(req: NextRequest): boolean {
  return SESSION_COOKIE_NAMES.some((name) => Boolean(req.cookies.get(name)?.value));
}
