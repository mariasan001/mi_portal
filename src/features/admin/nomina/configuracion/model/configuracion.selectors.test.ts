import { describe, expect, it } from 'vitest';

import {
  formatNominaBool,
  formatNominaDate,
  formatNominaDateTimeLong,
  formatNominaTitle,
  getContentEyebrow,
  getDetailDescription,
  getContentTitle,
  getSearchButtonLabel,
  getSearchLabel,
  getSearchPlaceholder,
} from './configuracion.selectors';

describe('configuracion.selectors', () => {
  it('formats short dates and keeps invalid values untouched', () => {
    expect(formatNominaDate('2026-04-08T12:00:00')).toBe('08/04/2026');
    expect(formatNominaDate('no-date')).toBe('no-date');
    expect(formatNominaDate('')).toBe('-');
  });

  it('formats booleans and humanizes titles', () => {
    expect(formatNominaBool(true)).toBe('Sí');
    expect(formatNominaBool(false)).toBe('No');
    expect(formatNominaTitle('  VERSION_GENERAL  ')).toBe('Version General');
    expect(formatNominaTitle(null)).toBe('-');
  });

  it('builds a long date-time string and keeps invalid input untouched', () => {
    const result = formatNominaDateTimeLong('2026-04-08T18:06:00');

    expect(result).toContain('de');
    expect(result).not.toBe('2026-04-08T18:06:00');
    expect(formatNominaDateTimeLong('bad-input')).toBe('bad-input');
    expect(formatNominaDateTimeLong(undefined)).toBe('-');
  });

  it('returns the right labels and placeholders by entity', () => {
    expect(getSearchLabel('periodo')).toBe('Buscar período por ID');
    expect(getSearchLabel('version')).toBe('Buscar versión por ID');
    expect(getSearchPlaceholder('periodo')).toBe('Ej. 12');
    expect(getSearchPlaceholder('version')).toBe('Ej. 15');
    expect(getSearchButtonLabel('periodo')).toBe('Consultar período');
    expect(getSearchButtonLabel('version')).toBe('Consultar versión');
  });

  it('returns the right eyebrow and content titles by entity and mode', () => {
    expect(getContentEyebrow('periodo')).toBe('Período');
    expect(getContentEyebrow('version')).toBe('Versión');
    expect(getContentTitle('periodo', 'resultados')).toBe('Detalle del período');
    expect(getContentTitle('version', 'resultados')).toBe('Detalle de la versión');
    expect(getContentTitle('periodo', 'crear')).toBe('Crear o recuperar período');
    expect(getContentTitle('version', 'crear')).toBe('Crear versión');
  });

  it('returns a detail description that adapts to whether rows exist', () => {
    expect(getDetailDescription('periodo', false)).toContain('períodos registrados');
    expect(getDetailDescription('version', false)).toContain('versión activa');
    expect(getDetailDescription('periodo', true)).toContain('comparar períodos');
    expect(getDetailDescription('version', true)).toContain('comparar versiones');
  });
});
