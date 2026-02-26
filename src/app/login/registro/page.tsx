'use client';

import { AuthSplitLayout, RegisterForm, RegisterPayload, useRegister } from '@/features/auth';
import Link from 'next/link';
import { useMemo, useState } from 'react';


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
    reset();
    setValue((p) => ({ ...p, [key]: v }));
  }

  async function onSubmit() {
    const res = await submit(value);
    if (!res) return;
    setValue((p) => ({ ...p, password: '' }));
  }

  return (
    <AuthSplitLayout
      leftTitle="Crea tu cuenta y activa tu acceso."
      leftDescription="Regístrate con tu información para habilitar tus servicios en el portal."
      // Si tu panel izquierdo usa fondo por CSS, puedes quitar esto:
      leftImageSrc="/img/fondo.png"
      bottomLeft={
        <>
          ¿Ya tienes cuenta?{' '}
          <Link href="/login">
            Inicia sesión
          </Link>
        </>
      }
      bottomRight={
        <Link href="/privacidad">
          Aviso de privacidad
        </Link>
      }
    >
      <RegisterForm
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
        loading={loading}
        error={error}
        success={successMsg}
      />
    </AuthSplitLayout>
  );
}