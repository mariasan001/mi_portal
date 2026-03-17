'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { MenuResponse } from '../types/menu.types';
import { obtenerMenu } from '../services/menu.service';
import { toErrorMessage } from '@/lib/api/api.errores';

type UseMenuResult = {
  data: MenuResponse | null;
  loading: boolean;
  error: string | null;
  refresh: () => void; 
};

export function useMenu(appCode: string | null): UseMenuResult {
  const [data, setData] = useState<MenuResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // para refrescar manualmente sin “auto updates”
  const refreshTick = useRef(0);
  const bumpRefresh = () => {
    refreshTick.current += 1;
    // setState para disparar effect
    setData((prev) => prev);
  };

  useEffect(() => {
    const code = (appCode ?? '').trim();
    if (!code) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    let alive = true;
    setLoading(true);
    setError(null);

    // Dedupe en service => 1 sola request real.
    obtenerMenu(code)
      .then((res) => {
        if (!alive) return;
        setData(res);
      })
      .catch((e) => {
        if (!alive) return;
        setData(null);
        setError(toErrorMessage(e));
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      // No abortamos: StrictMode desmonta/monta y eso “ensucia” Network.
      // Solo marcamos que ya no estamos vivos.
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appCode, refreshTick.current]);

  return useMemo(
    () => ({
      data,
      loading,
      error,
      refresh: bumpRefresh,
    }),
    [data, loading, error]
  );
}