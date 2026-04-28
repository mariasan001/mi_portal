import { useDeferredValue, useMemo, useState } from 'react';

import type { VersionNominaDto } from '@/features/admin/nomina/shared/model/versiones.types';

import {
  formatNominaCompactPeriod,
  formatNominaStatusLabel,
  formatNominaTitle,
} from '../model/configuracion.selectors';

export function useVersionesExplorer(items: VersionNominaDto[]) {
  const [query, setQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');

  const deferredQuery = useDeferredValue(query);

  const stageOptions = useMemo(() => {
    const knownStages = ['Previa', 'Integrada'];
    const presentStages = items.map((item) => formatNominaTitle(item.stage));

    return Array.from(new Set([...knownStages, ...presentStages]));
  }, [items]);

  const statusOptions = useMemo(() => {
    return Array.from(new Set(items.map((item) => formatNominaStatusLabel(item.status))));
  }, [items]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    const filtered = items.filter((item) => {
      const stageText = formatNominaTitle(item.stage);
      const statusText = formatNominaStatusLabel(item.status);

      if (stageFilter !== 'all' && stageText !== stageFilter) {
        return false;
      }

      if (statusFilter !== 'all' && statusText !== statusFilter) {
        return false;
      }

      if (!normalizedQuery) return true;

      const periodText = formatNominaCompactPeriod(item.anio, item.quincena, item.periodCode);

      return [
        String(item.versionId),
        String(item.payPeriodId),
        String(item.anio ?? ''),
        String(item.quincena ?? ''),
        periodText,
        stageText,
        statusText,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);
    });

    return filtered.sort((a, b) =>
      sort === 'asc' ? a.versionId - b.versionId : b.versionId - a.versionId
    );
  }, [deferredQuery, items, sort, stageFilter, statusFilter]);

  const metaText =
    filteredItems.length === items.length
      ? `${items.length} registros`
      : `${filteredItems.length} de ${items.length} registros`;

  return {
    filteredItems,
    metaText,
    query,
    sort,
    stageFilter,
    stageOptions,
    statusFilter,
    statusOptions,
    setQuery,
    setSort,
    setStageFilter,
    setStatusFilter,
  };
}
