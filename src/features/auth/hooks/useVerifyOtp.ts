'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { toErrorMessage } from '@/lib/api/api.errores';
import { verificarOtp } from '../services/auth-password.service';
import type { VerifyOtpPurpose } from '../types/password.types';

type State = {
  loading: boolean;
  error: string | null;
  ok: boolean;
};

function safeTrim(v: string) {
  return (v ?? '').trim();
}

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
        const msg = 'Ingresa tu usuario o correo.';
        setState({ loading: false, error: msg, ok: false });
        toast.warning(msg);
        return false;
      }

      if (normalizedIdentifier.length < 3) {
        const msg = 'Ingresa un usuario o correo válido.';
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

      if (normalizedOtp.length < 4) {
        const msg = 'El código de verificación no es válido.';
        setState({ loading: false, error: msg, ok: false });
        toast.warning(msg);
        return false;
      }

      setState({ loading: true, error: null, ok: false });

      const tId = toast.loading('Validando código…');

      try {
        const res = await verificarOtp({
          usernameOrEmail: normalizedIdentifier,
          otp: normalizedOtp,
          purpose,
        });

        const ok = Boolean(res?.ok);

        if (ok) {
          setState({ loading: false, error: null, ok: true });
          toast.success('Código validado correctamente.', { id: tId });
          return true;
        }

        const msg =
          'Código inválido o expirado. Verifica e intenta nuevamente.';

        setState({ loading: false, error: msg, ok: false });
        toast.error(msg, { id: tId });
        return false;
      } catch (err) {
        const msg = toErrorMessage(err, 'Código inválido o expirado.');
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