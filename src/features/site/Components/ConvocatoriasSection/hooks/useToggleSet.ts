// src/features/site/Components/ConvocatoriasSection/hooks/useToggleSet.ts
'use client';

import { useCallback, useState } from 'react';

export function useToggleSet() {
  const [set, setSet] = useState<Set<string>>(() => new Set());

  const toggle = useCallback((id: string) => {
    setSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const has = useCallback((id: string) => set.has(id), [set]);

  return { set, toggle, has };
}