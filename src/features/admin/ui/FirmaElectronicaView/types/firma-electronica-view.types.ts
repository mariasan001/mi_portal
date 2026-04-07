import type { SignatureRequestStatus } from '../../../types/firma-electronica.types';

export type FirmaCreateFormState = {
  file: File | null;
  cuts: string;
  contrasena: string;
  nombre: string;
  descripcion: string;
};

export type FirmaFilterState = {
  status: SignatureRequestStatus | '';
  requestId: string;
};