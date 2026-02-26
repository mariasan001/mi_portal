'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

import { RegisterForm } from '@/features/auth/ui/RegisterForm/RegisterForm';
import { useRegister } from '@/features/auth/hooks/useRegister';
import type { RegisterPayload } from '@/features/auth/types/register.types';

const INITIAL: RegisterPayload = {
  claveSp: '',
  plaza: '',
  puesto: '',
  email: '',
  password: '',
  phone: '',
};

export default function RegisterPage() {
  const [value, setValue] = useState<RegisterPayload>(INITIAL);
  const { loading, error, data, submit, reset } = useRegister();

  const successMsg = useMemo(() => {
    if (!data) return null;
    return data.message ?? 'Registro exitoso. Ya puedes iniciar sesión.';
  }, [data]);

  function onChange<K extends keyof RegisterPayload>(key: K, v: RegisterPayload[K]) {
    reset(); // limpia alertas cuando editas
    setValue((p) => ({ ...p, [key]: v }));
  }

  async function onSubmit() {
    const res = await submit(value);
    if (!res) return;

    // opcional: limpiar password
    setValue((p) => ({ ...p, password: '' }));
  }

  return (
  
      <><RegisterForm
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      loading={loading}
      error={error}
      success={successMsg} /><div style={{ marginTop: 12, fontSize: 13, opacity: 0.8 }}>
        ¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link>
      </div></>
  );
}