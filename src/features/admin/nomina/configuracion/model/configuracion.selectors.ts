import type { ConfiguracionEntity } from './configuracion.types';

export function formatNominaDate(value: string) {
  if (!value) return '-';
  return value;
}

export function formatNominaBool(value: boolean) {
  return value ? 'Si' : 'No';
}

export function getSearchLabel(entity: ConfiguracionEntity) {
  return entity === 'periodo' ? 'Buscar periodo por ID' : 'Buscar version por ID';
}

export function getSearchPlaceholder(entity: ConfiguracionEntity) {
  return entity === 'periodo' ? 'Ej. 12' : 'Ej. 15';
}

export function getSearchButtonLabel(entity: ConfiguracionEntity) {
  return entity === 'periodo' ? 'Consultar periodo' : 'Consultar version';
}

export function getContentEyebrow(entity: ConfiguracionEntity) {
  return entity === 'periodo' ? 'Periodo' : 'Version';
}

export function getContentTitle(
  entity: ConfiguracionEntity,
  mode: 'resultados' | 'crear'
) {
  if (mode === 'resultados') {
    return entity === 'periodo'
      ? 'Resultado de consulta'
      : 'Resultado de version';
  }

  return entity === 'periodo'
    ? 'Crear o recuperar periodo'
    : 'Crear version';
}
