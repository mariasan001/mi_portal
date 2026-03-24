import { ArchivoNominaDto, EjecucionCatalogoDto, NominaFileType } from "@/features/admin/types/nomina-catalogo.types";
import { EjecucionPayrollStagingDto } from "@/features/admin/types/nomina-staging.types";

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
  createdByUserId: string;
  file: File | null;
};

export type CatalogoUploadRunResult = {
  archivo: ArchivoNominaDto | null;
  ejecucion: EjecucionCatalogoDto | null;
};

export type NominaCargasViewState = {
  activeEntity: NominaCargaEntity;
  searchFileId: string;
  isUploadModalOpen: boolean;
  activeError: string | null;
  consultMessage: string | null;
  lastCatalogoArchivo: ArchivoNominaDto | null;
  lastCatalogoEjecucion: EjecucionCatalogoDto | null;
  lastNominaEjecucion: EjecucionPayrollStagingDto | null;
};