const KEY = 'portal_auth_redirect';

export type AuthRedirectIntent = {
  appCode: string;
  returnTo: string;
};

export function setAuthRedirectIntent(v: AuthRedirectIntent) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(v));
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