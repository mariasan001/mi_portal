'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { toErrorMessage } from '@/lib/api/api.errores';

import { obtenerMenu } from '../api/menu.queries';
import type { MenuResponse } from '../model/menu.types';

type UseMenuResourceResult = {
  data: MenuResponse | null;
  loading: boolean;
  error: string | null;
  refresh: (force?: boolean) => Promise<void>;
};

export function useMenuResource(appCode: string | null): UseMenuResourceResult {
  const [data, setData] = useState<MenuResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const code = useMemo(() => (appCode ?? '').trim(), [appCode]);

  const loadMenu = useCallback(
    async (force = false) => {
      if (!code) {
        setData(null);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await obtenerMenu(code, { force });
        setData(response);
      } catch (error) {
        setData(null);
        setError(toErrorMessage(error, 'No se pudo cargar el menu.'));
      } finally {
        setLoading(false);
      }
    },
    [code]
  );

  useEffect(() => {
    void loadMenu(false);
  }, [loadMenu]);

  const refresh = useCallback(
    async (force = true) => {
      await loadMenu(force);
    },
    [loadMenu]
  );

  return useMemo(
    () => ({
      data,
      loading,
      error,
      refresh,
    }),
    [data, loading, error, refresh]
  );
}
