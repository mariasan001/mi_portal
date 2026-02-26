'use client';

import { useCallback, useState } from 'react';
import { toErrorMessage } from '@/lib/api/api.errores';
import { solicitarRecuperacion } from '../services/auth-password.service';

type State = { loading: boolean; error: string | null; ok: boolean };

export function useForgotPassword() {
  const [state, setState] = useState<State>({ loading: false, error: null, ok: false });

  const submit = useCallback(async (email: string) => {
    setState({ loading: true, error: null, ok: false });
    try {
      await solicitarRecuperacion({ email: email.trim() });
      setState({ loading: false, error: null, ok: true });
      return true;
    } catch (e) {
      setState({ loading: false, error: toErrorMessage(e, 'No se pudo solicitar recuperación'), ok: false });
      return false;
    }
  }, []);

  return { ...state, submit };
}