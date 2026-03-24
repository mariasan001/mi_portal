import type { NominaCargaEntity } from '../types/nomina-cargas.types';

export function getNominaCargasHeroTitle() {
  return 'Carga de archivos de nómina';
}

export function getNominaCargasHeroDescription() {
  return 'Gestiona archivos de catálogo y ejecuciones de nómina desde una misma sesión operativa.';
}

export function getToolbarSearchLabel(entity: NominaCargaEntity) {
  return entity === 'catalogo' ? 'Buscar catálogo por fileId' : 'Buscar nómina por fileId';
}

export function getToolbarSearchPlaceholder(entity: NominaCargaEntity) {
  return entity === 'catalogo'
    ? 'Ej. 125'
    : 'Ej. 240';
}

export function getToolbarPrimaryLabel(entity: NominaCargaEntity) {
  return entity === 'catalogo' ? 'Nuevo catálogo' : 'Ejecutar staging';
}

export function getContentEyebrow(entity: NominaCargaEntity) {
  return entity === 'catalogo' ? 'Carga de catálogo' : 'Carga de nómina';
}

export function getContentTitle(entity: NominaCargaEntity) {
  return entity === 'catalogo'
    ? 'Resultado del archivo y su ejecución'
    : 'Resultado del staging de nómina';
}

export function getEmptyTitle(entity: NominaCargaEntity) {
  return entity === 'catalogo'
    ? 'Sin actividad todavía'
    : 'Sin ejecución todavía';
}

export function getEmptyDescription(entity: NominaCargaEntity) {
  return entity === 'catalogo'
    ? 'Sube un nuevo archivo de catálogo o ejecuta manualmente uno existente mediante su fileId.'
    : 'Ejecuta el staging de nómina mediante un fileId registrado para visualizar aquí el resultado.';
}

export function formatNominaDateTime(value?: string | null) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function formatBytes(value?: number | null) {
  if (!value || value <= 0) return '—';

  const units = ['B', 'KB', 'MB', 'GB'];
  let size = value;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  const decimals = size >= 10 ? 0 : 1;
  return `${size.toFixed(decimals)} ${units[unitIndex]}`;
}