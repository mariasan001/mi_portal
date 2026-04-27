import { describe, expect, it } from 'vitest';

import { isExternalHref } from './isExternalHref';

describe('isExternalHref', () => {
  it('detects http and https links as external', () => {
    expect(isExternalHref('https://example.com')).toBe(true);
    expect(isExternalHref('http://example.com')).toBe(true);
  });

  it('keeps internal and empty links as non-external', () => {
    expect(isExternalHref('/usuario/comprobantes')).toBe(false);
    expect(isExternalHref(undefined)).toBe(false);
  });
});
