import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Nombre(s) posibles de cookie de sesión.
 * Ajusta aquí al nombre real que te manda el IAM en Set-Cookie.
 */
const COOKIES_SESION = ['iam_session', 'JSESSIONID', 'SESSION', 'sid'] as const;

function tieneCookieSesion(req: NextRequest): boolean {
  return COOKIES_SESION.some((name) => Boolean(req.cookies.get(name)?.value));
}

function buildLoginRedirect(req: NextRequest): NextResponse {
  const url = req.nextUrl.clone();
  const next = `${req.nextUrl.pathname}${req.nextUrl.search}`;
  url.pathname = '/login';
  url.searchParams.set('next', next);
  return NextResponse.redirect(url);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ No tocar rutas públicas/estáticas
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap.xml') ||
    pathname.startsWith('/api') // dejamos API libre (tu proxy necesita funcionar)
  ) {
    return NextResponse.next();
  }

  // ✅ Protege admin
  if (pathname.startsWith('/admin')) {
    if (!tieneCookieSesion(req)) {
      return buildLoginRedirect(req);
    }
  }

  return NextResponse.next();
}

/**
 * Solo corre en estas rutas (más rápido y sin ruido).
 */
export const config = {
  matcher: ['/admin/:path*'],
};
