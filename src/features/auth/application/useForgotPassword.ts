'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { toErrorMessage } from '@/lib/api/api.errors';

import { solicitarRecuperacion } from '../api/password.commands';
import { isValidEmail, safeTrim } from '../utils/authInput';

type State = {
  loading: boolean;
  error: string | null;
  ok: boolean;
};

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
      const message = 'Ingresa tu correo electronico.';
      setState({ loading: false, error: message, ok: false });
      toast.warning(message);
      return false;
    }

    if (!isValidEmail(normalizedEmail)) {
      const message = 'Ingresa un correo valido.';
      setState({ loading: false, error: message, ok: false });
      toast.warning(message);
      return false;
    }

    setState({ loading: true, error: null, ok: false });

    const toastId = toast.loading('Enviando codigo de verificacion...');

    try {
      await solicitarRecuperacion({ email: normalizedEmail });

      setState({ loading: false, error: null, ok: true });

      toast.success(
        'Si el correo esta registrado, enviaremos un codigo de verificacion.',
        { id: toastId }
      );

      return true;
    } catch (error) {
      const message = toErrorMessage(error, 'No se pudo solicitar recuperacion');

      setState({ loading: false, error: message, ok: false });
      toast.error(message, { id: toastId });

      return false;
    }
  }, []);

  return {
    ...state,
    submit,
    reset,
  };
}
