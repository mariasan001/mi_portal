'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toErrorMessage } from '@/lib/api/api.errores';
import { obtenerMenu } from '../services/menu.service';
import type { MenuResponse } from '../types/menu.types';

type UseMenuResult = {
  data: MenuResponse | null;
  loading: boolean;
  error: string | null;
  refresh: (force?: boolean) => Promise<void>;
};

export function useMenu(appCode: string | null): UseMenuResult {
  const [data, setData] = useState<MenuResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const code = useMemo(() => (appCode ?? '').trim(), [appCode]);

  const cargarMenu = useCallback(
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
      } catch (e) {
        setData(null);
        setError(toErrorMessage(e, 'No se pudo cargar el menú.'));
      } finally {
        setLoading(false);
      }
    },
    [code]
  );

  useEffect(() => {
    let alive = true;

    if (!code) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    obtenerMenu(code)
      .then((response) => {
        if (!alive) return;
        setData(response);
      })
      .catch((e) => {
        if (!alive) return;
        setData(null);
        setError(toErrorMessage(e, 'No se pudo cargar el menú.'));
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [code]);

  const refresh = useCallback(
    async (force = true) => {
      await cargarMenu(force);
    },
    [cargarMenu]
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