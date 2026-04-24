'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { toErrorMessage } from '@/lib/api/api.errores';

import { verificarOtp } from '../api/password.commands';
import type { VerifyOtpPurpose } from '../model/password.types';
import { safeTrim } from '../utils/authInput';

type State = {
  loading: boolean;
  error: string | null;
  ok: boolean;
};

export function useVerifyOtp() {
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

  const submit = useCallback(
    async (
      usernameOrEmail: string,
      otp: string,
      purpose: VerifyOtpPurpose
    ) => {
      const normalizedIdentifier = safeTrim(usernameOrEmail);
      const normalizedOtp = safeTrim(otp);

      if (!normalizedIdentifier) {
        const message = 'Ingresa tu usuario o correo.';
        setState({ loading: false, error: message, ok: false });
        toast.warning(message);
        return false;
      }

      if (normalizedIdentifier.length < 3) {
        const message = 'Ingresa un usuario o correo valido.';
        setState({ loading: false, error: message, ok: false });
        toast.warning(message);
        return false;
      }

      if (!normalizedOtp) {
        const message = 'Ingresa el codigo de verificacion.';
        setState({ loading: false, error: message, ok: false });
        toast.warning(message);
        return false;
      }

      if (normalizedOtp.length < 4) {
        const message = 'El codigo de verificacion no es valido.';
        setState({ loading: false, error: message, ok: false });
        toast.warning(message);
        return false;
      }

      setState({ loading: true, error: null, ok: false });

      const toastId = toast.loading('Validando codigo...');

      try {
        const response = await verificarOtp({
          usernameOrEmail: normalizedIdentifier,
          otp: normalizedOtp,
          purpose,
        });

        if (response?.ok) {
          setState({ loading: false, error: null, ok: true });
          toast.success('Codigo validado correctamente.', { id: toastId });
          return true;
        }

        const message =
          'Codigo invalido o expirado. Verifica e intenta nuevamente.';

        setState({ loading: false, error: message, ok: false });
        toast.error(message, { id: toastId });
        return false;
      } catch (error) {
        const message = toErrorMessage(error, 'Codigo invalido o expirado.');
        setState({ loading: false, error: message, ok: false });
        toast.error(message, { id: toastId });
        return false;
      }
    },
    []
  );

  return {
    ...state,
    submit,
    reset,
  };
}
