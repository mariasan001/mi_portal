'use client';

import { useCallback, useState } from 'react';
import { toErrorMessage } from '@/lib/api/api.errores';
import {
  obtenerPayrollErrors,
  obtenerPayrollPreview,
  obtenerPayrollSummary,
} from '../services/nomina-procesamiento.service';
import type {
  PayrollErrorRowDto,
  PayrollPreviewRowDto,
  PayrollSummaryDto,
} from '../types/nomina-procesamiento.types';

export function useNominaProcesamiento() {
  const [summary, setSummary] = useState<PayrollSummaryDto | null>(null);
  const [previewRows, setPreviewRows] = useState<PayrollPreviewRowDto[]>([]);
  const [errorRows, setErrorRows] = useState<PayrollErrorRowDto[]>([]);

  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingErrors, setLoadingErrors] = useState(false);

  const [errorSummary, setErrorSummary] = useState<string | null>(null);
  const [errorPreview, setErrorPreview] = useState<string | null>(null);
  const [errorErrors, setErrorErrors] = useState<string | null>(null);

  const consultarSummary = useCallback(async (fileId: number) => {
    try {
      setLoadingSummary(true);
      setErrorSummary(null);

      const response = await obtenerPayrollSummary(fileId);
      setSummary(response);

      return response;
    } catch (e) {
      const message = toErrorMessage(e, 'No se pudo consultar el resumen');
      setErrorSummary(message);
      throw e;
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  const consultarPreview = useCallback(async (fileId: number, limit = 20) => {
    try {
      setLoadingPreview(true);
      setErrorPreview(null);

      const response = await obtenerPayrollPreview(fileId, limit);
      setPreviewRows(response);

      return response;
    } catch (e) {
      const message = toErrorMessage(e, 'No se pudo consultar el preview');
      setErrorPreview(message);
      throw e;
    } finally {
      setLoadingPreview(false);
    }
  }, []);

  const consultarErrors = useCallback(async (fileId: number, limit = 50) => {
    try {
      setLoadingErrors(true);
      setErrorErrors(null);

      const response = await obtenerPayrollErrors(fileId, limit);
      setErrorRows(response);

      return response;
    } catch (e) {
      const message = toErrorMessage(e, 'No se pudo consultar el detalle de errores');
      setErrorErrors(message);
      throw e;
    } finally {
      setLoadingErrors(false);
    }
  }, []);

  return {
    summary,
    previewRows,
    errorRows,

    loadingSummary,
    loadingPreview,
    loadingErrors,

    errorSummary,
    errorPreview,
    errorErrors,

    consultarSummary,
    consultarPreview,
    consultarErrors,
  };
}