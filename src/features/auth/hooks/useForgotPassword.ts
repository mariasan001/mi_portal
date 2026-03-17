'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { toErrorMessage } from '@/lib/api/api.errores';
import { solicitarRecuperacion } from '../services/auth-password.service';

type State = {
  loading: boolean;
  error: string | null;
  ok: boolean;
};

function safeTrim(v: string) {
  return (v ?? '').trim();
}

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export function useForgotPassword() {
  const [state, setState] = useState<State>({
    loading: false,
    error: null,
    ok: false,
  });

  const reset = useCallback(() => {
    setState((prev) => {
      if (!prev.error && !prev.ok) return prev;
      return {
        ...prev,
        error: null,
        ok: false,
      };
    });
  }, []);

  const submit = useCallback(async (email: string) => {
    const normalizedEmail = safeTrim(email);

    if (!normalizedEmail) {
      const msg = 'Ingresa tu correo electrónico.';
      setState({ loading: false, error: msg, ok: false });
      toast.warning(msg);
      return false;
    }

    if (!isValidEmail(normalizedEmail)) {
      const msg = 'Ingresa un correo válido.';
      setState({ loading: false, error: msg, ok: false });
      toast.warning(msg);
      return false;
    }

    setState({ loading: true, error: null, ok: false });

    const tId = toast.loading('Enviando código de verificación…');

    try {
      await solicitarRecuperacion({ email: normalizedEmail });

      setState({ loading: false, error: null, ok: true });

      toast.success(
        'Si el correo está registrado, enviaremos un código de verificación.',
        { id: tId }
      );

      return true;
    } catch (err) {
      const msg = toErrorMessage(err, 'No se pudo solicitar recuperación');

      setState({ loading: false, error: msg, ok: false });
      toast.error(msg, { id: tId });

      return false;
    }
  }, []);

  return {
    ...state,
    submit,
    reset,
  };
}