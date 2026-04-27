import type { NominaFileType } from '@/features/admin/nomina/shared/model/catalogo.types';

export type NominaCargaEntity = 'catalogo' | 'nomina';

export type NominaCargaModalStatus =
  | 'idle'
  | 'selected'
  | 'uploading'
  | 'running'
  | 'success'
  | 'error';

export type CatalogoModalForm = {
  versionId: string;
  fileType: NominaFileType;
  file: File | null;
};
