'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { toErrorMessage } from '@/lib/api/api.errores';
import { solicitarRecuperacion } from '../services/auth-password.service';

type State = { loading: boolean; error: string | null; ok: boolean };

function safeTrim(v: string) {
  return (v ?? '').trim();
}

export function useForgotPassword() {
  const [state, setState] = useState<State>({ loading: false, error: null, ok: false });

  const submit = useCallback(async (email: string) => {
    const e = safeTrim(email);

    if (e.length < 4) {
      toast.warning('Ingresa un correo válido.');
      setState((s) => ({ ...s, error: 'Ingresa un correo válido.', ok: false }));
      return false;
    }

    setState({ loading: true, error: null, ok: false });

    const tId = toast.loading('Enviando código de verificación…');

    try {
      await solicitarRecuperacion({ email: e });

      setState({ loading: false, error: null, ok: true });

      toast.success('Si el correo está registrado, enviaremos un código de verificación.', { id: tId });
      return true;
    } catch (err) {
      const msg = toErrorMessage(err, 'No se pudo solicitar recuperación');

      setState({ loading: false, error: msg, ok: false });

      toast.error(msg, { id: tId });
      return false;
    }
  }, []);

  return { ...state, submit };
}