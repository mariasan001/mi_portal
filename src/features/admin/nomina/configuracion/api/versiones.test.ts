import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/api/api.cliente', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

import { api } from '@/lib/api/api.cliente';
import { API_RUTAS } from '@/lib/api/api.routes';

import { crearVersionNomina, obtenerVersionNomina } from './versiones';

const mockedApi = vi.mocked(api, true);

describe('configuracion/api/versiones', () => {
  it('queries the version detail route with the provided signal', () => {
    const signal = new AbortController().signal;

    obtenerVersionNomina(31, { signal });

    expect(mockedApi.get).toHaveBeenCalledWith(
      API_RUTAS.nomina.versionDetalle(31),
      { signal }
    );
  });

  it('posts the create payload to the versions endpoint', () => {
    const signal = new AbortController().signal;
    const payload = {
      payPeriodId: 14,
      stage: 'PREVIA' as const,
      notes: 'Prueba',
      createdByUserId: 9,
    };

    crearVersionNomina(payload, { signal });

    expect(mockedApi.post).toHaveBeenCalledWith(
      API_RUTAS.nomina.versiones,
      payload,
      { signal }
    );
  });
});
