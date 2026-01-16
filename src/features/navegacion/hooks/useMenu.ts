'use client';

import { useEffect, useMemo, useState } from 'react';
import type { MenuResponse } from '../types/menu.types';
import { obtenerMenu } from '../services/menu.service';
import { toErrorMessage } from '@/lib/api/api.errores';

type MenuInternalState = {
  /** appCode al que pertenece el último resultado guardado */
  appCode: string | null;
  /** respuesta del menú (solo válida si coincide appCode) */
  data: MenuResponse | null;
  /** error (solo válido si coincide appCode) */
  error: string | null;
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
        // ✅ setState dentro de callback async (permitido por la regla)
        setState({ appCode, data: res, error: null });
      })
      .catch((e) => {
        if (ctrl.signal.aborted) return;
        // ✅ setState dentro de callback async (permitido por la regla)
        setState({ appCode, data: null, error: toErrorMessage(e) });
      });

    return () => ctrl.abort();
  }, [appCode]);

  /**
   * Estado "visto por UI":
   * - Si el state no corresponde al appCode actual, para la UI es como si no hubiera data/error aún.
   * - loading se deriva: hay appCode y aún no tenemos resultado para ese appCode.
   */
  return useMemo(() => {
    if (!appCode) return { data: null, loading: false, error: null };

    const isCurrent = state.appCode === appCode;

    const data = isCurrent ? state.data : null;
    const error = isCurrent ? state.error : null;

    const loading = !isCurrent && error === null; // “aún no llega respuesta para este appCode”

    return { data, loading, error };
  }, [appCode, state]);
}
