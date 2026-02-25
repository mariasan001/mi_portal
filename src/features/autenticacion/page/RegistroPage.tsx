// src/features/auth/pages/RegistroPage.tsx
'use client';

import { useState } from 'react';
import s from './RegistroPage.module.css';
import RegisterForm from '../components/RegisterForm';

type RegisterPayload = {
  claveSp: string;
  plaza: string;
  puesto: string;
  email: string;
  password: string;
  phone: string;
};

export default function RegistroPage() {
  const [form, setForm] = useState<RegisterPayload>({
    claveSp: '',
    plaza: '',
    puesto: '',
    email: '',
    password: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField<K extends keyof RegisterPayload>(key: K, value: RegisterPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit() {
    setError(null);
    setLoading(true);

    try {
      // ✅ Aquí conectas tu API real
      // await registerService.register(form);

      console.log('REGISTER PAYLOAD:', form);
    } catch (e) {
      setError('Ocurrió un error al registrar. Verifica tus datos e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={s.page}>
      <RegisterForm
        value={form}
        onChange={setField}
        onSubmit={onSubmit}
        loading={loading}
        error={error}
      />
    </main>
  );
}