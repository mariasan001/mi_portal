const KEY = 'portal_auth_redirect';
const AUTH_QUERY_KEY = 'auth';
const APP_CODE_QUERY_KEY = 'appCode';
const RETURN_TO_QUERY_KEY = 'returnTo';

export type AuthRedirectIntent = {
  appCode: string;
  returnTo: string;
};

function safeTrim(value: string | null | undefined) {
  return (value ?? '').trim();
}

export function setAuthRedirectIntent(value: AuthRedirectIntent) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    // noop
  }
}

export function getAuthRedirectIntent(): AuthRedirectIntent | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthRedirectIntent;
  } catch {
    return null;
  }
}

export function clearAuthRedirectIntent() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // noop
  }
}

export function buildAuthModalHref(args?: {
  returnTo?: string | null;
  appCode?: string | null;
  initialView?: 'login';
}) {
  const params = new URLSearchParams();
  params.set(AUTH_QUERY_KEY, args?.initialView ?? 'login');

  const returnTo = safeTrim(args?.returnTo);
  if (returnTo.startsWith('/')) {
    params.set(RETURN_TO_QUERY_KEY, returnTo);
  }

  const appCode = safeTrim(args?.appCode);
  if (appCode) {
    params.set(APP_CODE_QUERY_KEY, appCode);
  }

  return `/?${params.toString()}`;
}

export function stripAuthModalQuery(pathname: string, searchParams: URLSearchParams) {
  const nextParams = new URLSearchParams(searchParams);
  nextParams.delete(AUTH_QUERY_KEY);
  nextParams.delete(APP_CODE_QUERY_KEY);
  nextParams.delete(RETURN_TO_QUERY_KEY);

  const nextQuery = nextParams.toString();
  return nextQuery ? `${pathname}?${nextQuery}` : pathname;
}
