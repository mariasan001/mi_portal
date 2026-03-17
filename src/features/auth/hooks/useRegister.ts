'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { ApiError, toErrorMessage } from '@/lib/api/api.errores';
import type {
  RegisterPayload,
  RegisterResponse,
} from '../types/register.types';

import { registerUser } from '../services/auth-register.service';

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function safeTrim(v: string) {
  return (v ?? '').trim();
}

function validate(payload: RegisterPayload): string | null {
  if (!safeTrim(payload.claveSp)) return 'Ingresa tu Clave SP.';
  if (!safeTrim(payload.plaza)) return 'Ingresa tu Plaza.';
  if (!safeTrim(payload.puesto)) return 'Ingresa tu Puesto.';

  if (!safeTrim(payload.email)) return 'Ingresa tu correo.';
  if (!isValidEmail(payload.email)) return 'Correo inválido.';

  if ((payload.password ?? '').length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres.';
  }

  if (!safeTrim(payload.phone)) return 'Ingresa tu teléfono.';

  return null;
}

function mapRegisterError(e: unknown): string {
  if (e instanceof ApiError) {
    if (e.status === 409) {
      return 'Ese usuario o correo ya está registrado.';
    }

    if (e.status === 400) {
      return 'Datos inválidos o no elegible.';
    }
  }

  return toErrorMessage(e, 'No se pudo registrar');
}

type State = {
  loading: boolean;
  error: string | null;
  success: string | null;
  data: RegisterResponse | null;
};

export function useRegister() {
  const [state, setState] = useState<State>({
    loading: false,
    error: null,
    success: null,
    data: null,
  });

  const reset = useCallback(() => {
    setState({
      loading: false,
      error: null,
      success: null,
      data: null,
    });
  }, []);

  const submit = useCallback(async (payload: RegisterPayload) => {
    const validation = validate(payload);

    if (validation) {
      setState({
        loading: false,
        error: validation,
        success: null,
        data: null,
      });

      toast.error(validation);
      return null;
    }

    setState({
      loading: true,
      error: null,
      success: null,
      data: null,
    });

    const tId = toast.loading('Creando cuenta…');

    try {
      const res = await registerUser(payload);

      setState({
        loading: false,
        error: null,
        success: 'Cuenta creada correctamente.',
        data: res,
      });

      toast.success(
        'Cuenta creada correctamente. Ya puedes iniciar sesión.',
        { id: tId }
      );

      return res;
    } catch (err) {
      const msg = mapRegisterError(err);

      setState({
        loading: false,
        error: msg,
        success: null,
        data: null,
      });

      toast.error(msg, { id: tId });

      return null;
    }
  }, []);

  return {
    ...state,
    submit,
    reset,
  };
}