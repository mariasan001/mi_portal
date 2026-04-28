import { describe, expect, it } from 'vitest';

import {
  formatNominaCompactPeriod,
  formatNominaDate,
  formatNominaStatusLabel,
  formatNominaStatusTone,
  formatNominaTitle,
  getContentEyebrow,
  getContentTitle,
} from './configuracion.selectors';

describe('configuracion.selectors', () => {
  it('formats short dates and keeps invalid values untouched', () => {
    expect(formatNominaDate('2026-04-08T12:00:00')).toBe('08/04/2026');
    expect(formatNominaDate('no-date')).toBe('no-date');
    expect(formatNominaDate('')).toBe('-');
  });

  it('formats compact periods and humanizes titles', () => {
    expect(formatNominaCompactPeriod(2026, 4, 'Q4')).toBe('2026 / Q4');
    expect(formatNominaCompactPeriod(undefined, undefined, 'P-12')).toBe('P-12');
    expect(formatNominaTitle('  VERSION_GENERAL  ')).toBe('Version General');
    expect(formatNominaTitle(null)).toBe('-');
  });

  it('maps status to a tone and Spanish label', () => {
    expect(formatNominaStatusTone('LOADED')).toBe('info');
    expect(formatNominaStatusTone('RELEASED')).toBe('success');
    expect(formatNominaStatusTone('FAILED')).toBe('danger');
    expect(formatNominaStatusLabel('LOADED')).toBe('Cargada');
    expect(formatNominaStatusLabel('RELEASED')).toBe('Liberada');
    expect(formatNominaStatusLabel('PROCESSING')).toBe('En proceso');
  });

  it('returns the correct modal eyebrow and title by entity', () => {
    expect(getContentEyebrow('periodo')).toBe('Período');
    expect(getContentEyebrow('version')).toBe('Versión');
    expect(getContentTitle('periodo')).toBe('Crear o recuperar período');
    expect(getContentTitle('version')).toBe('Crear versión');
  });
});
