import type { NominaEntity } from '../types/nomina-configuracion.types';

export function formatNominaDate(value: string) {
  if (!value) return '—';
  return value;
}

export function formatNominaBool(value: boolean) {
  return value ? 'Sí' : 'No';
}

export function getSearchLabel(entity: NominaEntity) {
  return entity === 'periodo' ? 'Buscar periodo por ID' : 'Buscar versión por ID';
}

export function getSearchPlaceholder(entity: NominaEntity) {
  return entity === 'periodo' ? 'Ej. 12' : 'Ej. 15';
}

export function getSearchButtonLabel(entity: NominaEntity) {
  return entity === 'periodo' ? 'Consultar periodo' : 'Consultar versión';
}

export function getContentEyebrow(entity: NominaEntity) {
  return entity === 'periodo' ? 'Periodo' : 'Versión';
}

export function getContentTitle(
  entity: NominaEntity,
  mode: 'resultados' | 'crear'
) {
  if (mode === 'resultados') {
    return entity === 'periodo'
      ? 'Resultado de consulta'
      : 'Resultado de versión';
  }

  return entity === 'periodo'
    ? 'Crear o recuperar periodo'
    : 'Crear versión';
}