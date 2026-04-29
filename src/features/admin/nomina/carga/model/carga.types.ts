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
  files: File[];
};

export type NominaCargaBackgroundTaskStatus =
  | 'idle'
  | 'uploading'
  | 'running'
  | 'success'
  | 'error';

export type NominaCargaBackgroundTask = {
  visible: boolean;
  title: string;
  detail: string;
  progress: number;
  status: NominaCargaBackgroundTaskStatus;
  currentItemLabel?: string;
  currentIndex?: number;
  totalItems?: number;
};
