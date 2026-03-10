    import type { ReadonlyURLSearchParams } from 'next/navigation';

export function getLoginFlowParams(sp: ReadonlyURLSearchParams) {
  const appCodeFromQuery = sp.get('appCode')?.trim() || null;
  const returnTo = sp.get('returnTo') || '/';
  return { appCodeFromQuery, returnTo };
}