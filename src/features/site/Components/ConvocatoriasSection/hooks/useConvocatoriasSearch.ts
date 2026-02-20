// src/features/site/Components/ConvocatoriasSection/hooks/useConvocatoriasSearch.ts
'use client';

import { useMemo } from 'react';
import { normalize } from '../utils/convocatoriasUtils';

type PostCard = {
  id: string;
  title: string;
  desc: string;
  img?: string;
  tag?: string;
  href?: string;
};

export function useConvocatoriasSearch(posts: PostCard[], query: string) {
  const results = useMemo(() => {
    const q = normalize(query);
    if (q.length < 2) return [];

    return posts
      .map((p, index) => ({ ...p, index }))
      .filter((p) => normalize(`${p.title} ${p.desc} ${p.tag ?? ''}`).includes(q))
      .slice(0, 6);
  }, [query, posts]);

  return { results };
}