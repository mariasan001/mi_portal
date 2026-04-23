import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { hasSessionCookie } from '@/lib/auth/session';

function buildLoginRedirect(req: NextRequest): NextResponse {
  const url = req.nextUrl.clone();
  const next = `${req.nextUrl.pathname}${req.nextUrl.search}`;
  url.pathname = '/login';
  url.searchParams.set('next', next);
  return NextResponse.redirect(url);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap.xml') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin') && !hasSessionCookie(req)) {
    return buildLoginRedirect(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
