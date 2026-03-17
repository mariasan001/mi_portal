'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { toErrorMessage } from '@/lib/api/api.errores';
import { resetearContrasena } from '../services/auth-password.service';

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

      if (!normalizedOtp) {
        const msg = 'Ingresa el código de verificación.';
        setState({ loading: false, error: msg, ok: false });
        toast.warning(msg);
        return false;
      }

      if ((newPassword ?? '').length < 8) {
        const msg = 'La contraseña debe tener al menos 8 caracteres.';
        setState({ loading: false, error: msg, ok: false });
        toast.warning(msg);
        return false;
      }

      setState({ loading: true, error: null, ok: false });

      const tId = toast.loading('Guardando nueva contraseña…');

      try {
        const res = await resetearContrasena({
          email: normalizedEmail,
          otp: normalizedOtp,
          newPassword,
        });

        const ok = Boolean(res?.ok);

        if (ok) {
          setState({ loading: false, error: null, ok: true });
          toast.success('Contraseña actualizada correctamente.', { id: tId });
          return true;
        }

        const msg =
          'No fue posible actualizar la contraseña. Verifica el código e intenta nuevamente.';

        setState({ loading: false, error: msg, ok: false });
        toast.error(msg, { id: tId });
        return false;
      } catch (err) {
        const msg = toErrorMessage(err, 'No se pudo restablecer contraseña');
        setState({ loading: false, error: msg, ok: false });
        toast.error(msg, { id: tId });
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