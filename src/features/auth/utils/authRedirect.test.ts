import { describe, expect, it, vi } from 'vitest';

import {
  buildAuthModalHref,
  clearAuthRedirectIntent,
  getAuthRedirectIntent,
  setAuthRedirectIntent,
  stripAuthModalQuery,
} from './authRedirect';

describe('authRedirect', () => {
  it('builds an auth modal href with safe query params only', () => {
    expect(
      buildAuthModalHref({
        returnTo: '/admin/nomina/carga?tab=files',
        appCode: 'PLAT_SERV',
      })
    ).toBe('/?auth=login&returnTo=%2Fadmin%2Fnomina%2Fcarga%3Ftab%3Dfiles&appCode=PLAT_SERV');
  });

  it('does not include an unsafe external returnTo', () => {
    expect(
      buildAuthModalHref({
        returnTo: 'https://evil.example',
        appCode: 'PLAT_SERV',
      })
    ).toBe('/?auth=login&appCode=PLAT_SERV');
  });

  it('stores and clears redirect intent in sessionStorage', () => {
    setAuthRedirectIntent({ appCode: 'PLAT_SERV', returnTo: '/admin' });
    expect(getAuthRedirectIntent()).toEqual({
      appCode: 'PLAT_SERV',
      returnTo: '/admin',
    });

    clearAuthRedirectIntent();
    expect(getAuthRedirectIntent()).toBeNull();
  });

  it('returns null when sessionStorage contains invalid JSON', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('{bad json');
    expect(getAuthRedirectIntent()).toBeNull();
  });

  it('removes auth query parameters from the current URL', () => {
    const params = new URLSearchParams(
      'auth=login&appCode=PLAT_SERV&returnTo=%2Fadmin&foo=bar'
    );

    expect(stripAuthModalQuery('/', params)).toBe('/?foo=bar');
  });
});
