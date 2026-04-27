'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { ApiError, toErrorMessage } from '@/lib/api/api.errors';

import { registerUser } from '../api/register.commands';
import type {
  RegisterPayload,
  RegisterResponse,
} from '../model/register.types';
import { isValidEmail, safeTrim } from '../utils/authInput';

function validate(payload: RegisterPayload): string | null {
  if (!safeTrim(payload.claveSp)) return 'Ingresa tu Clave SP.';
  if (!safeTrim(payload.plaza)) return 'Ingresa tu Plaza.';
  if (!safeTrim(payload.puesto)) return 'Ingresa tu Puesto.';

  if (!safeTrim(payload.email)) return 'Ingresa tu correo.';
  if (!isValidEmail(payload.email)) return 'Correo invalido.';

  if ((payload.password ?? '').length < 8) {
    return 'La contrasena debe tener al menos 8 caracteres.';
  }

  if (!safeTrim(payload.phone)) return 'Ingresa tu telefono.';

  return null;
}

function mapRegisterError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 409) {
      return 'Ese usuario o correo ya esta registrado.';
    }

    if (error.status === 400) {
      return 'Datos invalidos o no elegible.';
    }
  }

  return toErrorMessage(error, 'No se pudo registrar');
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

    const toastId = toast.loading('Creando cuenta...');

    try {
      const response = await registerUser(payload);

      setState({
        loading: false,
        error: null,
        success: 'Cuenta creada correctamente.',
        data: response,
      });

      toast.success('Cuenta creada correctamente. Ya puedes iniciar sesion.', {
        id: toastId,
      });

      return response;
    } catch (error) {
      const message = mapRegisterError(error);

      setState({
        loading: false,
        error: message,
        success: null,
        data: null,
      });

      toast.error(message, { id: toastId });
      return null;
    }
  }, []);

  return {
    ...state,
    submit,
    reset,
  };
}
