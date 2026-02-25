export type RegisterPayload = {
  claveSp: string;
  plaza: string;
  puesto: string;
  email: string;
  password: string;
  phone: string;
};

export type RegisterResponse = {
  userId: number;
  username: string;
  status: string; // "ACTIVE" etc.
  message?: string;
};

export function esRegisterPayload(v: unknown): v is RegisterPayload {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;

  const isNonEmpty = (x: unknown) => typeof x === 'string' && x.trim().length > 0;

  return (
    isNonEmpty(o.claveSp) &&
    isNonEmpty(o.plaza) &&
    isNonEmpty(o.puesto) &&
    isNonEmpty(o.email) &&
    isNonEmpty(o.password) &&
    isNonEmpty(o.phone)
  );
}