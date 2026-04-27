import { describe, expect, it } from 'vitest';

import { buildQueryString } from './buildQueryString';

describe('buildQueryString', () => {
  it('returns an empty string when no params are provided', () => {
    expect(buildQueryString()).toBe('');
  });

  it('ignores undefined, null, and empty string values', () => {
    expect(
      buildQueryString({
        payPeriodId: 202601,
        status: undefined,
        emptyValue: '',
        entity: null as unknown as string,
      })
    ).toBe('?payPeriodId=202601');
  });

  it('serializes mixed string and numeric values', () => {
    expect(
      buildQueryString({
        sp: 'ABC12345',
        page: 2,
      })
    ).toBe('?sp=ABC12345&page=2');
  });
});
