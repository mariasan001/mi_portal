import { useDeferredValue, useMemo, useState } from 'react';

import type { ArchivoNominaDto } from '@/features/admin/nomina/shared/model/catalogo.types';

import type { NominaCargaEntity } from '../model/carga.types';
import {
  formatNominaStatusLabel,
  formatNominaTitle,
} from '../model/carga.selectors';

export function useCargaFilesExplorer(
  items: ArchivoNominaDto[],
  activeEntity: NominaCargaEntity
) {
  const [query, setQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');

  const deferredQuery = useDeferredValue(query);

  const scopedItems = useMemo(() => {
    return items.filter((item) =>
      activeEntity === 'catalogo' ? item.fileType === 'CATALOGO' : item.fileType !== 'CATALOGO'
    );
  }, [activeEntity, items]);

  const stageOptions = useMemo(() => {
    const knownStages = ['Previa', 'Integrada'];
    const presentStages = scopedItems.map((item) => formatNominaTitle(item.stage));
    return Array.from(new Set([...knownStages, ...presentStages]));
  }, [scopedItems]);

  const statusOptions = useMemo(() => {
    return Array.from(new Set(scopedItems.map((item) => formatNominaStatusLabel(item.status))));
  }, [scopedItems]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    const filtered = scopedItems.filter((item) => {
      const stageText = formatNominaTitle(item.stage);
      const statusText = formatNominaStatusLabel(item.status);

      if (stageFilter !== 'all' && stageText !== stageFilter) {
        return false;
      }

      if (statusFilter !== 'all' && statusText !== statusFilter) {
        return false;
      }

      if (!normalizedQuery) return true;

      return [
        String(item.fileId),
        String(item.versionId),
        String(item.payPeriodId),
        item.periodCode,
        item.fileType,
        item.fileName,
        stageText,
        statusText,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);
    });

    return filtered.sort((a, b) => (sort === 'asc' ? a.fileId - b.fileId : b.fileId - a.fileId));
  }, [deferredQuery, scopedItems, sort, stageFilter, statusFilter]);

  const metaText =
    filteredItems.length === scopedItems.length
      ? `${scopedItems.length} ${scopedItems.length === 1 ? 'registro' : 'registros'}`
      : `${filteredItems.length} de ${scopedItems.length} registros`;

  return {
    filteredItems,
    metaText,
    query,
    stageFilter,
    stageOptions,
    statusFilter,
    statusOptions,
    sort,
    setQuery,
    setStageFilter,
    setStatusFilter,
    setSort,
  };
}
