import { AUTH_APP_CODE_KEY } from '../model/auth.constants';

export function readAuthAppCode(): string | null {
  try {
    return localStorage.getItem(AUTH_APP_CODE_KEY);
  } catch {
    return null;
  }
}

export function writeAuthAppCode(value: string) {
  try {
    localStorage.setItem(AUTH_APP_CODE_KEY, value);
  } catch {
    // noop
  }
}

export function clearAuthAppCode() {
  try {
    localStorage.removeItem(AUTH_APP_CODE_KEY);
  } catch {
    // noop
  }
}
