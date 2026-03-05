'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { toErrorMessage } from '@/lib/api/api.errores';
import { resetearContrasena } from '../services/auth-password.service';

type State = { loading: boolean; error: string | null; ok: boolean };

function safeTrim(v: string) {
  return (v ?? '').trim();
}

export function useResetPassword() {
  const [state, setState] = useState<State>({ loading: false, error: null, ok: false });

  const submit = useCallback(async (email: string, otp: string, newPassword: string) => {
    const e = safeTrim(email);
    const code = safeTrim(otp);

    if (e.length < 4) {
      toast.warning('Ingresa un correo válido.');
      setState((s) => ({ ...s, error: 'Ingresa un correo válido.', ok: false }));
      return false;
    }

    if (!code) {
      toast.warning('Ingresa el código de verificación.');
      setState((s) => ({ ...s, error: 'Ingresa el código de verificación.', ok: false }));
      return false;
    }

    if ((newPassword ?? '').length < 8) {
      toast.warning('La contraseña debe tener al menos 8 caracteres.');
      setState((s) => ({ ...s, error: 'La contraseña debe tener al menos 8 caracteres.', ok: false }));
      return false;
    }

    setState({ loading: true, error: null, ok: false });

    const tId = toast.loading('Guardando nueva contraseña…');

    try {
      const res = await resetearContrasena({
        email: e,
        otp: code,
        newPassword,
      });

      const ok = Boolean(res?.ok);

      setState({ loading: false, error: null, ok });

      if (ok) {
        toast.success('Contraseña actualizada correctamente.', { id: tId });
        return true;
      }

      // Si el backend responde ok=false sin throw
      const msg = 'No fue posible actualizar la contraseña. Verifica el código e intenta nuevamente.';
      setState({ loading: false, error: msg, ok: false });
      toast.error(msg, { id: tId });
      return false;
    } catch (err) {
      const msg = toErrorMessage(err, 'No se pudo restablecer contraseña');
      setState({ loading: false, error: msg, ok: false });
      toast.error(msg, { id: tId });
      return false;
    }
  }, []);

  return { ...state, submit };
}