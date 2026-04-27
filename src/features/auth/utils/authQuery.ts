import type { ReadonlyURLSearchParams } from 'next/navigation';
import type { AuthView } from '../ui/AuthModal/AuthModal';

function safeTrim(value: string | null | undefined) {
  return (value ?? '').trim();
}

function isAuthView(value: string): value is AuthView {
  return ['login', 'register', 'forgot', 'otp', 'reset'].includes(value);
}

export function getLoginFlowParams(sp: ReadonlyURLSearchParams) {
  const rawAuth = safeTrim(sp.get('auth'));
  const appCodeFromQuery = safeTrim(sp.get('appCode')) || null;
  const returnTo = safeTrim(sp.get('returnTo')) || '/';

  return {
    authView: isAuthView(rawAuth) ? rawAuth : null,
    appCodeFromQuery,
    returnTo,
  };
}
