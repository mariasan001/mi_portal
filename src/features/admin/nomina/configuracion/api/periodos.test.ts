import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/api/api.cliente', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

import { api } from '@/lib/api/api.cliente';
import { API_RUTAS } from '@/lib/api/api.routes';

import { crearORecuperarPeriodoNomina, obtenerPeriodoNomina } from './periodos';

const mockedApi = vi.mocked(api, true);

describe('configuracion/api/periodos', () => {
  it('queries the period detail route with the provided signal', () => {
    const signal = new AbortController().signal;

    obtenerPeriodoNomina(25, { signal });

    expect(mockedApi.get).toHaveBeenCalledWith(
      API_RUTAS.nomina.periodDetalle(25),
      { signal }
    );
  });

  it('posts the create payload to the periods endpoint', () => {
    const signal = new AbortController().signal;
    const payload = {
      anio: 2026,
      quincena: 4,
      fechaInicio: '2026-02-01',
      fechaFin: '2026-02-15',
      fechaPagoEstimada: '2026-02-20',
    };

    crearORecuperarPeriodoNomina(payload, { signal });

    expect(mockedApi.post).toHaveBeenCalledWith(
      API_RUTAS.nomina.periods,
      payload,
      { signal }
    );
  });
});
