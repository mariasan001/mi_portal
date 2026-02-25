'use client';

import { useCallback, useState } from 'react';
import { ApiError, toErrorMessage } from '@/lib/api/api.errores';
import type { RegisterPayload, RegisterResponse } from '../types/register.types';
import { registerUser } from '../services/auth-register.service';

type State = {
  loading: boolean;
  error: string | null;
  data: RegisterResponse | null;
};

function mapRegisterError(e: unknown): string {
  if (e instanceof ApiError) {
    if (e.status === 409) return 'Ese usuario o correo ya está registrado.';
    if (e.status === 400) return 'Datos inválidos o no elegible. Revisa Clave SP, Plaza y Puesto.';
  }
  return toErrorMessage(e, 'No se pudo registrar');
}

export function useRegister() {
  const [state, setState] = useState<State>({ loading: false, error: null, data: null });

  const reset = useCallback(() => {
    setState({ loading: false, error: null, data: null });
  }, []);

  const submit = useCallback(async (payload: RegisterPayload) => {
    setState({ loading: true, error: null, data: null });
    try {
      const res = await registerUser(payload);
      setState({ loading: false, error: null, data: res });
      return res;
    } catch (e) {
      setState({ loading: false, error: mapRegisterError(e), data: null });
      return null;
    }
  }, []);

  return { ...state, submit, reset };
}