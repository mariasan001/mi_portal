'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { useNominaFilesResource } from '@/features/admin/nomina/carga/application/useNominaFilesResource';

import {
  findProcesamientoFileByFilters,
  getProcesamientoDefaultLimit,
  getProcesamientoNameOptions,
  getProcesamientoPeriodOptions,
  matchesProcesamientoFilters,
} from '../model/procesamiento.selectors';
import { useProcesamientoResource } from './useProcesamientoResource';

export function useProcesamientoController() {
  const domain = useProcesamientoResource();
  const files = useNominaFilesResource();
  const lastAutoQueryRef = useRef('');

  const [selectedFileId, setSelectedFileId] = useState('');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [nameFilter, setNameFilter] = useState('all');
  const [hasConsultedSummary, setHasConsultedSummary] = useState(false);
  const [hasConsultedPreview, setHasConsultedPreview] = useState(false);
  const [hasConsultedErrors, setHasConsultedErrors] = useState(false);

  const sortedFiles = useMemo(
    () => [...files.lista].sort((left, right) => right.fileId - left.fileId),
    [files.lista]
  );

  const periodOptions = useMemo(() => getProcesamientoPeriodOptions(sortedFiles), [sortedFiles]);

  const filesByPeriod = useMemo(() => {
    return sortedFiles.filter((file) => {
      return matchesProcesamientoFilters({
        file,
        periodFilter,
        nameFilter: 'all',
      });
    });
  }, [periodFilter, sortedFiles]);

  const nameOptions = useMemo(
    () => getProcesamientoNameOptions(sortedFiles, periodFilter),
    [periodFilter, sortedFiles]
  );

  const selectedFile = useMemo(
    () => files.lista.find((item) => String(item.fileId) === selectedFileId) ?? null,
    [files.lista, selectedFileId]
  );

  const loading = domain.loadingSummary || domain.loadingPreview || domain.loadingErrors;

  const currentError = useMemo(() => {
    const messages = [
      files.errorLista,
      domain.errorSummary,
      domain.errorPreview,
      domain.errorErrors,
    ].filter(Boolean) as string[];

    return messages.length ? Array.from(new Set(messages)).join(' ') : null;
  }, [domain.errorErrors, domain.errorPreview, domain.errorSummary, files.errorLista]);

  const runConsult = useCallback(
    async (numericFileId: number) => {
      const previewLimit = Number(getProcesamientoDefaultLimit('preview'));
      const errorLimit = Number(getProcesamientoDefaultLimit('errors'));

      const results = await Promise.allSettled([
        domain.consultarSummary(numericFileId),
        domain.consultarPreview(numericFileId, previewLimit),
        domain.consultarErrors(numericFileId, errorLimit),
      ]);

      if (results[0].status === 'fulfilled') {
        setHasConsultedSummary(true);
      }

      if (results[1].status === 'fulfilled') {
        setHasConsultedPreview(true);
      }

      if (results[2].status === 'fulfilled') {
        setHasConsultedErrors(true);
      }

      const successCount = results.filter((result) => result.status === 'fulfilled').length;

      if (successCount === 3) {
        toast.success('Resumen, vista previa y errores consultados correctamente.');
        return;
      }

      if (successCount > 0) {
        toast.warning('Se consulto parcialmente el procesamiento. Revisa los mensajes de error.');
        return;
      }

      toast.error('No se pudo consultar la informacion del procesamiento.');
    },
    [domain]
  );

  const handleFileChange = useCallback(
    async (value: string) => {
      setSelectedFileId(value);
      setHasConsultedSummary(false);
      setHasConsultedPreview(false);
      setHasConsultedErrors(false);
      domain.resetAll();

      const numericFileId = Number(value);
      if (!Number.isFinite(numericFileId) || numericFileId <= 0) {
        return;
      }

      await runConsult(numericFileId);
    },
    [domain, runConsult]
  );

  const clearSelection = useCallback(() => {
    lastAutoQueryRef.current = '';
    setSelectedFileId('');
    setHasConsultedSummary(false);
    setHasConsultedPreview(false);
    setHasConsultedErrors(false);
    domain.resetAll();
  }, [domain]);

  const handleYearFilterChange = useCallback(
    (value: string) => {
      setPeriodFilter(value);
      setNameFilter('all');
      clearSelection();
    },
    [clearSelection]
  );

  const handleQueryChange = useCallback(
    async (value: string) => {
      setNameFilter(value);
      clearSelection();

      if (periodFilter === 'all' || value === 'all') {
        return;
      }

      const nextMatchedFile = findProcesamientoFileByFilters({
        files: filesByPeriod,
        periodFilter,
        nameFilter: value,
      });

      if (!nextMatchedFile) {
        return;
      }

      const autoQueryKey = `${periodFilter}::${value}::${nextMatchedFile.fileId}`;
      if (lastAutoQueryRef.current === autoQueryKey) {
        return;
      }

      lastAutoQueryRef.current = autoQueryKey;
      await handleFileChange(String(nextMatchedFile.fileId));
    },
    [clearSelection, filesByPeriod, handleFileChange, periodFilter]
  );

  return {
    selectedFileId,
    selectedFile,
    periodFilter,
    periodOptions,
    nameFilter,
    nameOptions,
    setPeriodFilter: handleYearFilterChange,
    setNameFilter: handleQueryChange,
    loading,
    currentError,
    hasConsultedSummary,
    hasConsultedPreview,
    hasConsultedErrors,
    summary: domain.summary,
    previewRows: domain.previewRows,
    errorRows: domain.errorRows,
  };
}
