'use client';

import { useCallback, useRef, useState } from 'react';
import { RegistroRequestDTO, RegistroResponseDTO } from '../types/register.types';
import { registrarServidorPublico } from '../services/register.service';

type State = {
  loading: boolean;
  error: string | null;
  success: RegistroResponseDTO | null;
};

function pickErrorMessage(err: unknown): string {
  // si tu api.cliente lanza Error con message, esto lo captura
  if (typeof err === 'object' && err !== null && 'message' in err) {
    const m = (err as { message?: unknown }).message;
    if (typeof m === 'string' && m.trim()) return m;
  }
  return 'No se pudo completar el registro. Intenta de nuevo.';
}

export function useRegistro() {
  const abortRef = useRef<AbortController | null>(null);

  const [state, setState] = useState<State>({
    loading: false,
    error: null,
    success: null,
  });

  const registrar = useCallback(async (payload: RegistroRequestDTO) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState({ loading: true, error: null, success: null });

    try {
      const data = await registrarServidorPublico(payload, { signal: controller.signal });
      setState({ loading: false, error: null, success: data });
      return data;
    } catch (err: unknown) {
      if (controller.signal.aborted) return;
      setState({ loading: false, error: pickErrorMessage(err), success: null });
      throw err;
    }
  }, []);

  return { ...state, registrar };
}