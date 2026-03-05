'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { toErrorMessage } from '@/lib/api/api.errores';
import { verificarOtp } from '../services/auth-password.service';
import type { VerifyOtpPurpose } from '../types/password.types';

type State = { loading: boolean; error: string | null; ok: boolean };

function safeTrim(v: string) {
  return (v ?? '').trim();
}

export function useVerifyOtp() {
  const [state, setState] = useState<State>({ loading: false, error: null, ok: false });

  const submit = useCallback(
    async (usernameOrEmail: string, otp: string, purpose: VerifyOtpPurpose) => {
      const u = safeTrim(usernameOrEmail);
      const code = safeTrim(otp);

      if (u.length < 3) {
        toast.warning('Ingresa tu usuario o correo.');
        setState((s) => ({ ...s, error: 'Ingresa tu usuario o correo.', ok: false }));
        return false;
      }

      if (code.length < 4) {
        toast.warning('Ingresa el código de verificación.');
        setState((s) => ({ ...s, error: 'Ingresa el código de verificación.', ok: false }));
        return false;
      }

      setState({ loading: true, error: null, ok: false });

      const tId = toast.loading('Validando código…');

      try {
        const res = await verificarOtp({ usernameOrEmail: u, otp: code, purpose });

        const ok = Boolean(res?.ok);
        setState({ loading: false, error: null, ok });

        if (ok) {
          toast.success('Código validado correctamente.', { id: tId });
          return true;
        }

        // backend respondió ok=false sin throw
        const msg = 'Código inválido o expirado. Verifica e intenta nuevamente.';
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

  return { ...state, submit };
}