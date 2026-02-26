'use client';

import { useCallback, useState } from 'react';
import { toErrorMessage } from '@/lib/api/api.errores';
import { verificarOtp } from '../services/auth-password.service';
import type { VerifyOtpPurpose } from '../types/password.types';

type State = { loading: boolean; error: string | null; ok: boolean };

export function useVerifyOtp() {
  const [state, setState] = useState<State>({ loading: false, error: null, ok: false });

  const submit = useCallback(async (usernameOrEmail: string, otp: string, purpose: VerifyOtpPurpose) => {
    setState({ loading: true, error: null, ok: false });
    try {
      const res = await verificarOtp({ usernameOrEmail: usernameOrEmail.trim(), otp: otp.trim(), purpose });
      setState({ loading: false, error: null, ok: Boolean(res?.ok) });
      return Boolean(res?.ok);
    } catch (e) {
      setState({ loading: false, error: toErrorMessage(e, 'OTP inválido'), ok: false });
      return false;
    }
  }, []);

  return { ...state, submit };
}