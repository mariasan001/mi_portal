'use client';

import { useMemo, useState } from 'react';
import type { DocItem, PanelKey } from '../utils/guides.types';
import { matchesQuery, sortByUpdatedDesc } from '../utils/guides.utils';

type Params = {
  docs: DocItem[];
};

export function useGuides({ docs }: Params) {
  const [query, setQuery] = useState('');
  const [openPanel, setOpenPanel] = useState<PanelKey>('top');

  const hasQuery = query.trim().length > 0;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return docs.filter((d) => matchesQuery(d, q));
  }, [docs, query]);

  const topDocs = useMemo(() => docs.filter((d) => d.isTop).slice(0, 6), [docs]);

  const recentDocs = useMemo(() => {
    return [...docs].sort(sortByUpdatedDesc).slice(0, 6);
  }, [docs]);

  return {
    query,
    setQuery,
    openPanel,
    setOpenPanel,
    hasQuery,
    results,
    topDocs,
    recentDocs,
  };
}