'use client';

import { useCallback, useState } from 'react';
import { toErrorMessage } from '@/lib/api/api.errores';
import { resetearContrasena } from '../services/auth-password.service';

type State = { loading: boolean; error: string | null; ok: boolean };

export function useResetPassword() {
  const [state, setState] = useState<State>({ loading: false, error: null, ok: false });

  const submit = useCallback(async (email: string, otp: string, newPassword: string) => {
    setState({ loading: true, error: null, ok: false });
    try {
      const res = await resetearContrasena({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      });
      setState({ loading: false, error: null, ok: Boolean(res?.ok) });
      return Boolean(res?.ok);
    } catch (e) {
      setState({ loading: false, error: toErrorMessage(e, 'No se pudo restablecer contraseña'), ok: false });
      return false;
    }
  }, []);

  return { ...state, submit };
}