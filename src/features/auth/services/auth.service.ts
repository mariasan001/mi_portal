import { api } from '@/lib/api/api.cliente';
import { API_RUTAS } from '@/lib/api/api.rutas';
import type { RegisterPayload, RegisterResponse } from '../types/register.types';

export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  return api.post<RegisterResponse>(API_RUTAS.auth.register, payload);
}