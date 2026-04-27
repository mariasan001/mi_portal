import { describe, expect, it } from 'vitest';

import {
  errorState,
  idleState,
  loadingState,
  successState,
} from './request-state';

describe('request-state helpers', () => {
  it('builds an idle state with null data by default', () => {
    expect(idleState<string>()).toEqual({
      data: null,
      loading: false,
      error: null,
    });
  });

  it('preserves existing data in idle state when provided', () => {
    expect(idleState({ id: 12 })).toEqual({
      data: { id: 12 },
      loading: false,
      error: null,
    });
  });

  it('marks the request as loading and keeps current data', () => {
    expect(loadingState(['current'])).toEqual({
      data: ['current'],
      loading: true,
      error: null,
    });
  });

  it('builds a success state with the resolved payload', () => {
    expect(successState({ ok: true })).toEqual({
      data: { ok: true },
      loading: false,
      error: null,
    });
  });

  it('builds an error state and preserves current data when available', () => {
    expect(errorState('No se pudo cargar', { cached: true })).toEqual({
      data: { cached: true },
      loading: false,
      error: 'No se pudo cargar',
    });
  });
});
