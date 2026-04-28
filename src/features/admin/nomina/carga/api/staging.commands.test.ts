import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/api/api.cliente', () => ({
  api: {
    post: vi.fn(),
  },
}));

import { api } from '@/lib/api/api.cliente';
import { API_RUTAS } from '@/lib/api/api.routes';

import { ejecutarPayrollStaging } from './staging.commands';

const mockedApi = vi.mocked(api, true);

describe('carga/api/staging.commands', () => {
  it('posts to the payroll staging endpoint with the optional signal', () => {
    const signal = new AbortController().signal;

    ejecutarPayrollStaging(22, { signal });

    expect(mockedApi.post).toHaveBeenCalledWith(
      API_RUTAS.nomina.ejecutarPayrollStaging(22),
      undefined,
      { signal }
    );
  });
});
