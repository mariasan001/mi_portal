import { api } from '@/lib/api/api.cliente';
import { API_RUTAS } from '@/lib/api/api.routes';

import type { ArchivoNominaDto } from '@/features/admin/nomina/shared/model/catalogo.types';

export function listarArchivosNomina(
  params?: { versionId?: number | string },
  opts?: { signal?: AbortSignal }
) {
  const qs =
    params?.versionId !== undefined && String(params.versionId).trim().length > 0
      ? `?versionId=${encodeURIComponent(String(params.versionId))}`
      : '';

  return api.get<ArchivoNominaDto[]>(`${API_RUTAS.nomina.files}${qs}`, {
    signal: opts?.signal,
  });
}
