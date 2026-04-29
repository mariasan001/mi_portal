import { describe, expect, it } from 'vitest';

import type { NominaPeriodoEstadoDto } from './monitoreo.types';
import {
  boolLabel,
  formatMonitoreoDate,
  formatNullable,
  formatPeriodoOptionLabel,
  getMonitoreoMainStatus,
  getMonitoreoOperationItems,
  getMonitoreoOperationStats,
} from './monitoreo.selectors';

const detalleBase: NominaPeriodoEstadoDto = {
  periodStateId: 1,
  payPeriodId: 8,
  periodCode: '082026',
  anio: 2026,
  quincena: 8,
  currentPreviaVersionId: 19,
  currentIntegradaVersionId: 0,
  previaLoaded: true,
  integradaLoaded: false,
  catalogLoaded: true,
  validated: false,
  released: false,
  releasedAt: null,
  releasedByUserId: null,
  hasCancellations: false,
  hasReexpeditions: true,
};

describe('monitoreo.selectors', () => {
  it('formats labels and nullable values', () => {
    expect(boolLabel(true)).toBe('Si');
    expect(boolLabel(false)).toBe('No');
    expect(formatNullable(null)).toBe('Sin registro');
    expect(formatNullable(19)).toBe('19');
  });

  it('formats dates and period options', () => {
    expect(formatMonitoreoDate(null)).toBe('Sin fecha registrada');
    expect(formatMonitoreoDate('no-date')).toBe('no-date');
    expect(
      formatPeriodoOptionLabel({
        periodId: 8,
        anio: 2026,
        quincena: 8,
        periodoCode: '082026',
        fechaInicio: '2026-04-01',
        fechaFin: '2026-04-15',
        fechaPagoEstimada: '2026-04-15',
      })
    ).toContain('082026');
  });

  it('computes the main status and operation stats', () => {
    expect(getMonitoreoMainStatus(detalleBase)).toEqual({
      label: 'Con alertas operativas',
      tone: 'danger',
    });

    expect(getMonitoreoOperationStats(detalleBase)).toEqual({
      okCount: 3,
      total: 7,
    });
  });

  it('builds operation items with the expected tones', () => {
    const items = getMonitoreoOperationItems(detalleBase);

    expect(items).toHaveLength(7);
    expect(items[0]).toMatchObject({ label: 'Previa cargada', tone: 'ok', value: true });
    expect(items[1]).toMatchObject({
      label: 'Integrada cargada',
      tone: 'neutral',
      value: false,
    });
    expect(items[5]).toMatchObject({
      label: 'Cancelaciones',
      tone: 'ok',
      value: false,
    });
    expect(items[6]).toMatchObject({
      label: 'Reexpediciones',
      tone: 'warn',
      value: true,
    });
  });
});
