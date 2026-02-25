// src/features/autenticacion/types/registro.types.ts
export type RegistroRequestDTO = {
  claveSp: string;
  plaza: string;
  puesto: string;
  email: string;
  password: string;
  phone: string;
};

export type RegistroResponseDTO = {
  userId: number;
  username: string;
  status: 'ACTIVE' | string;
  message: string;
};