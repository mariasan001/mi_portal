export type NominaFileType =
  | 'TCOMP'
  | 'TCALC'
  | 'HNCOMADI'
  | 'HNCOMGRA'
  | 'COMP'
  | 'CALC'
  | 'CONTAGUB'
  | 'CATALOGO';

export type ArchivoNominaDto = {
  fileId: number;
  versionId: number;
  fileType: NominaFileType;
  fileName: string;
  filePath: string;
  checksumSha256: string;
  fileSizeBytes: number;
  status: 'UPLOADED' | string;
  uploadedAt: string;
};

export type UploadArchivoNominaPayload = {
  versionId: number;
  fileType: NominaFileType;
  createdByUserId?: number;
  file: File;
};

export type EjecucionCatalogoDto = {
  executionId: number;
  fileId: number;
  jobName: string;
};