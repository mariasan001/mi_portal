import { describe, expect, it } from 'vitest';

import {
  formatBytes,
  formatFileTypeLabel,
  formatNominaFileDisplayName,
  formatNominaStatusLabel,
  formatNominaTitle,
  formatVersionDisplayLabel,
  getNominaStatusTone,
  inferNominaFileTypeFromName,
} from './carga.selectors';

describe('carga.selectors', () => {
  it('formats byte sizes into readable units', () => {
    expect(formatBytes()).toBeTruthy();
    expect(formatBytes(1024)).toBe('1.0 KB');
    expect(formatBytes(12 * 1024 * 1024)).toBe('12 MB');
  });

  it('maps backend statuses to user-facing labels and tones', () => {
    expect(formatNominaStatusLabel('PROCESSED')).toBe('Procesado');
    expect(formatNominaStatusLabel('PROCESSING')).toBe('En proceso');
    expect(formatNominaStatusLabel('UPLOADED')).toBe('Cargado');
    expect(getNominaStatusTone('PROCESSED')).toBe('success');
    expect(getNominaStatusTone('ERROR')).toBe('danger');
    expect(getNominaStatusTone('UPLOADED')).toBe('neutral');
  });

  it('builds display labels for versions and titles', () => {
    expect(formatVersionDisplayLabel('042026', 7)).toBe('042026');
    expect(formatVersionDisplayLabel(undefined, 7)).toBe('#7');
    expect(formatNominaTitle('hncomadi')).toBe('Hncomadi');
    expect(formatFileTypeLabel('TCOMP')).toBe('TCOMP');
  });

  it('infers file types from the file name', () => {
    expect(inferNominaFileTypeFromName('hncomgra042026.dbf')).toBe('HNCOMGRA');
    expect(inferNominaFileTypeFromName('nomina_tcalc0426.dbf')).toBe('TCALC');
    expect(inferNominaFileTypeFromName('desconocido.dbf')).toBeNull();
  });

  it('formats visible file names without duplicated prefixes', () => {
    expect(formatNominaFileDisplayName('hncomgra_hncomgra042026.dbf', 'HNCOMGRA')).toBe(
      'HNCOMGRA 042026.dbf'
    );
    expect(formatNominaFileDisplayName('tcomp0426.dbf', 'TCOMP')).toBe('TCOMP 0426.dbf');
    expect(formatNominaFileDisplayName('archivo-libre.dbf')).toBe('archivo-libre.dbf');
  });
});
