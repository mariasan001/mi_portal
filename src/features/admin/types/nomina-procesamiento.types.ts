import type { NominaFileType } from './nomina-catalogo.types';
import type { NominaStage, NominaStatus } from './nomina-versiones.types';

export type PayrollSummaryDto = {
  fileId: number;
  fileType: NominaFileType;
  fileStatus: string;
  fileName: string;
  filePath: string;
  versionId: number;
  stage: NominaStage;
  versionStatus: NominaStatus;
  payPeriodId: number;
  periodCode: string;
  totalRowsInFile: number;
  processedRows: number;
  errorRows: number;
};

export type PayrollPreviewRowDto = {
  fileId: number;
  rowNum: number;
  fileType: string;
  payPeriodCode: string;
  receiptPeriodCode: string;
  neyemp: string;
  neyrfc: string;
  negnom: string;
  necpza: string;
  necads: string;
  neccat: string;
  negppa: string;
  necche: string;
  necrec: string;
  necsex: string;
  netipi: string;
  nefocuRaw: string;
  fechaOcupacionInicio: string;
  fechaOcupacionFin: string;
  ocupacionIndefinida: boolean;
  nominaTipo: number;
  isReexpedition: boolean;
  neitpe: number;
  neitde: number;
  neipne: number;
  loadStatus: string;
};

export type PayrollErrorRowDto = {
  fileId: number;
  rowNum: number;
  fileType: string;
  payPeriodCode: string;
  receiptPeriodCode: string;
  neyemp: string;
  necpza: string;
  nominaTipo: number;
  isReexpedition: boolean;
  errorDetail: string;
};