// src/features/autenticacion/services/registro.service.ts
import { api } from '@/lib/api/api.cliente';
import { API_RUTAS } from '@/lib/api/api.rutas';
import { RegistroRequestDTO, RegistroResponseDTO } from '../types/register.types';

export function registrarServidorPublico(payload: RegistroRequestDTO, opts?: { signal?: AbortSignal }) {
  return api.post<RegistroResponseDTO>(API_RUTAS.auth.register, payload, {
    signal: opts?.signal,
  });
}