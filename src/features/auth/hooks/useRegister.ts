'use client';

import { useCallback, useState } from 'react';
import { toErrorMessage } from '@/lib/api/api.errores';
import type { RegisterPayload, RegisterResponse } from '../types/register.types';
import { registerUser } from '../services/auth.service';

type UseRegisterResult = {
  submit: (payload: RegisterPayload) => Promise<RegisterResponse | null>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
};

export function useRegister(): UseRegisterResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const submit = useCallback(async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await registerUser(payload);
      return res;
    } catch (e) {
      setError(toErrorMessage(e, 'No se pudo registrar'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, loading, error, clearError };
}