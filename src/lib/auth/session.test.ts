import { describe, expect, it } from 'vitest';
import type { NextRequest } from 'next/server';

import { hasSessionCookie, hasSessionCookieHeader } from './session';

function createMockRequest(cookies: Record<string, string>): NextRequest {
  const entries = Object.entries(cookies).map(([name, value]) => ({ name, value }));

  return {
    cookies: {
      get: (name: string) =>
        entries.find((entry) => entry.name === name)
          ? { value: cookies[name] }
          : undefined,
      getAll: () => entries,
    },
  } as unknown as NextRequest;
}

describe('auth/session', () => {
  it('detects known session cookies in a cookie header', () => {
    expect(hasSessionCookieHeader('foo=bar; iam_session=abc123')).toBe(true);
  });

  it('returns false when the cookie header is empty', () => {
    expect(hasSessionCookieHeader('')).toBe(false);
  });

  it('keeps permissive behavior when any cookie is present', () => {
    expect(hasSessionCookieHeader('custom_cookie=value')).toBe(true);
  });

  it('detects a known session cookie in NextRequest cookies', () => {
    expect(hasSessionCookie(createMockRequest({ iam_session: 'abc123' }))).toBe(true);
  });

  it('returns false when NextRequest has no cookies', () => {
    expect(hasSessionCookie(createMockRequest({}))).toBe(false);
  });
});
