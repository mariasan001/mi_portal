'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { toErrorMessage } from '@/lib/api/api.errores';

import { resetearContrasena } from '../api/password.commands';
import { isValidEmail, safeTrim } from '../utils/authInput';

type State = {
  loading: boolean;
  error: string | null;
  ok: boolean;
};

export function useResetPassword() {
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
    async (email: string, otp: string, newPassword: string) => {
      const normalizedEmail = safeTrim(email);
      const normalizedOtp = safeTrim(otp);

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

      if (!normalizedOtp) {
        const message = 'Ingresa el codigo de verificacion.';
        setState({ loading: false, error: message, ok: false });
        toast.warning(message);
        return false;
      }

      if ((newPassword ?? '').length < 8) {
        const message = 'La contrasena debe tener al menos 8 caracteres.';
        setState({ loading: false, error: message, ok: false });
        toast.warning(message);
        return false;
      }

      setState({ loading: true, error: null, ok: false });

      const toastId = toast.loading('Guardando nueva contrasena...');

      try {
        const response = await resetearContrasena({
          email: normalizedEmail,
          otp: normalizedOtp,
          newPassword,
        });

        if (response?.ok) {
          setState({ loading: false, error: null, ok: true });
          toast.success('Contrasena actualizada correctamente.', {
            id: toastId,
          });
          return true;
        }

        const message =
          'No fue posible actualizar la contrasena. Verifica el codigo e intenta nuevamente.';

        setState({ loading: false, error: message, ok: false });
        toast.error(message, { id: toastId });
        return false;
      } catch (error) {
        const message = toErrorMessage(error, 'No se pudo restablecer contrasena');
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
