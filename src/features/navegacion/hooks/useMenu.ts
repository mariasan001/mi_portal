'use client';

import { useEffect, useMemo, useState } from 'react';
import type { MenuResponse } from '../types/menu.types';
import { obtenerMenu } from '../services/menu.service';
import { toErrorMessage } from '@/lib/api/api.errores';

type MenuInternalState = {
  appCode: string | null;      // a qué appCode pertenece el último resultado
  data: MenuResponse | null;   // data sólo válida si appCode coincide
  error: string | null;        // error sólo válido si appCode coincide
};

type UseMenuResult = {
  data: MenuResponse | null;
  loading: boolean;
  error: string | null;
};

export function useMenu(appCode: string | null): UseMenuResult {
  const [state, setState] = useState<MenuInternalState>({
    appCode: null,
    data: null,
    error: null,
  });

  useEffect(() => {
    if (!appCode) return;

    const ctrl = new AbortController();

    obtenerMenu(appCode, { signal: ctrl.signal })
      .then((res) => {
        setState({ appCode, data: res, error: null });
      })
      .catch((e) => {
        if (ctrl.signal.aborted) return;
        setState({ appCode, data: null, error: toErrorMessage(e) });
      });

    return () => ctrl.abort();
  }, [appCode]);

  return useMemo(() => {
    if (!appCode) return { data: null, loading: false, error: null };

    const isCurrent = state.appCode === appCode;

    return {
      data: isCurrent ? state.data : null,
      error: isCurrent ? state.error : null,
      loading: !isCurrent, // loading derivado: aún no hay respuesta para este appCode
    };
  }, [appCode, state]);
}
