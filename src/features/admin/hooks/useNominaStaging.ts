'use client';

import { useCallback, useState } from 'react';
import { toErrorMessage } from '@/lib/api/api.errores';
import { ejecutarPayrollStaging } from '../services/nomina-staging.service';
import type { EjecucionPayrollStagingDto } from '../types/nomina-staging.types';

export function useNominaStaging() {
  const [ejecucion, setEjecucion] = useState<EjecucionPayrollStagingDto | null>(null);
  const [loadingRun, setLoadingRun] = useState(false);
  const [errorRun, setErrorRun] = useState<string | null>(null);

  const runStaging = useCallback(async (fileId: number) => {
    try {
      setLoadingRun(true);
      setErrorRun(null);

      const response = await ejecutarPayrollStaging(fileId);
      setEjecucion(response);

      return response;
    } catch (e) {
      const message = toErrorMessage(e, 'No se pudo ejecutar el staging de nómina');
      setErrorRun(message);
      throw e;
    } finally {
      setLoadingRun(false);
    }
  }, []);

  return {
    ejecucion,
    loadingRun,
    errorRun,
    runStaging,
  };
}