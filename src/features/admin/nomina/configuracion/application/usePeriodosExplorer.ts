import { useDeferredValue, useMemo, useState } from 'react';

import type { PeriodoNominaDto } from '@/features/admin/nomina/shared/model/periodos.types';

import { formatNominaCompactPeriod } from '../model/configuracion.selectors';

export function usePeriodosExplorer(items: PeriodoNominaDto[]) {
  const [query, setQuery] = useState('');
  const [quincenaFilter, setQuincenaFilter] = useState('all');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');

  const deferredQuery = useDeferredValue(query);

  const quincenaOptions = useMemo(() => {
    return Array.from(new Set(items.map((item) => item.quincena))).sort((a, b) => a - b);
  }, [items]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    const filtered = items.filter((item) => {
      if (quincenaFilter !== 'all') {
        const expected = Number(quincenaFilter);
        if (item.quincena !== expected) return false;
      }

      if (!normalizedQuery) return true;

      const periodText = formatNominaCompactPeriod(
        item.anio,
        item.quincena,
        item.periodoCode
      ).toLowerCase();

      return [
        String(item.periodId),
        String(item.anio),
        String(item.quincena),
        `q${item.quincena}`,
        periodText,
      ].some((value) => value.includes(normalizedQuery));
    });

    return filtered.sort((a, b) =>
      sort === 'asc' ? a.periodId - b.periodId : b.periodId - a.periodId
    );
  }, [deferredQuery, items, quincenaFilter, sort]);

  const metaText =
    filteredItems.length === items.length
      ? `${items.length} registros`
      : `${filteredItems.length} de ${items.length} registros`;

  return {
    filteredItems,
    metaText,
    query,
    quincenaFilter,
    quincenaOptions,
    sort,
    setQuery,
    setQuincenaFilter,
    setSort,
  };
}
