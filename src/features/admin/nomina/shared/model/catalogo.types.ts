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
  payPeriodId: number;
  periodCode: string;
  stage: string;
  fileType: NominaFileType;
  fileName: string;
  filePath: string;
  checksumSha256: string;
  fileSizeBytes: number;
  rowCount?: number | null;
  status: 'UPLOADED' | string;
  uploadedAt: string;
  processedAt?: string | null;
  createdByUserId?: number;
  errorMessage?: string | null;
  metadata?: string;
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
