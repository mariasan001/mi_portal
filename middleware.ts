import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { buildAuthModalHref } from '@/features/auth/utils/authRedirect';
import { hasSessionCookie } from '@/lib/auth/session';
import { APP_ACCESS } from '@/app/_lib/access';
import { APP_ROUTES } from '@/app/_lib/routes';

function applySecurityHeaders(response: NextResponse) {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  response.headers.set(
    'Content-Security-Policy',
    "frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
  );
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  response.headers.set('Pragma', 'no-cache');

  return response;
}

function isBypassedPath(pathname: string) {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap.xml') ||
    pathname.startsWith('/api')
  );
}

function buildAuthRedirect(req: NextRequest, args?: { appCode?: string | null }) {
  const returnTo = `${req.nextUrl.pathname}${req.nextUrl.search}`;
  const href = buildAuthModalHref({
    returnTo,
    appCode: args?.appCode,
  });

  const url = req.nextUrl.clone();
  url.pathname = APP_ROUTES.home;
  url.search = href.startsWith('/?') ? href.slice(1) : '';

  return applySecurityHeaders(NextResponse.redirect(url));
}

function requiresUserAccess(pathname: string) {
  return pathname.startsWith(APP_ROUTES.usuario.root);
}

function requiresAdminAccess(pathname: string) {
  return pathname.startsWith(APP_ROUTES.admin.root);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isBypassedPath(pathname)) {
    return NextResponse.next();
  }

  if (requiresAdminAccess(pathname) && !hasSessionCookie(req)) {
    return buildAuthRedirect(req);
  }

  if (requiresUserAccess(pathname) && !hasSessionCookie(req)) {
    return buildAuthRedirect(req, { appCode: APP_ACCESS.usuario.appCode });
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ['/admin/:path*', '/usuario/:path*'],
};
