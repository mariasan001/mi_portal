import { api } from '@/lib/api/api.cliente';
import { API_RUTAS } from '@/lib/api/api.rutas';
import type {
  PayrollErrorRowDto,
  PayrollPreviewRowDto,
  PayrollSummaryDto,
} from '../model/procesamiento.types';

export function obtenerPayrollSummary(
  fileId: number,
  opts?: { signal?: AbortSignal }
) {
  return api.get<PayrollSummaryDto>(API_RUTAS.nomina.payrollSummary(fileId), {
    signal: opts?.signal,
  });
}

export function obtenerPayrollPreview(
  fileId: number,
  limit = 20,
  opts?: { signal?: AbortSignal }
) {
  return api.get<PayrollPreviewRowDto[]>(
    API_RUTAS.nomina.payrollPreview(fileId, limit),
    { signal: opts?.signal }
  );
}

export function obtenerPayrollErrors(
  fileId: number,
  limit = 50,
  opts?: { signal?: AbortSignal }
) {
  return api.get<PayrollErrorRowDto[]>(
    API_RUTAS.nomina.payrollErrors(fileId, limit),
    { signal: opts?.signal }
  );
}
