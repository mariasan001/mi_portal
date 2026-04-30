import { useDeferredValue, useMemo, useState } from 'react';

import type { RecibosVersionCardItem } from '../model/recibos.types';

export function useRecibosExplorer(items: RecibosVersionCardItem[]) {
  const [query, setQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');

  const deferredQuery = useDeferredValue(query);

  const stageOptions = useMemo(
    () => Array.from(new Set(items.map((item) => item.stageLabel))),
    [items]
  );

  const statusOptions = useMemo(
    () => Array.from(new Set(items.map((item) => item.statusLabel))),
    [items]
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    const filtered = items.filter((item) => {
      if (stageFilter !== 'all' && item.stageLabel !== stageFilter) {
        return false;
      }

      if (statusFilter !== 'all' && item.statusLabel !== statusFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return [
        String(item.version.versionId),
        item.version.periodCode,
        item.periodLabel,
        item.subtitle,
        item.stageLabel,
        item.statusLabel,
        item.progressLabel,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);
    });

    return filtered.sort((left, right) =>
      sort === 'asc'
        ? left.version.versionId - right.version.versionId
        : right.version.versionId - left.version.versionId
    );
  }, [deferredQuery, items, sort, stageFilter, statusFilter]);

  const metaText =
    filteredItems.length === items.length
      ? `${items.length} versiones`
      : `${filteredItems.length} de ${items.length} versiones`;

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
