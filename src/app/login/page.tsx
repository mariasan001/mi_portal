'use client';

import Link from 'next/link';

import { AuthCard, useLoginFlow } from '@/features/auth';
import LoginForm from '@/features/auth/ui/LoginForm/LoginForm';
export default function LoginPage() {
  const { username, setUsername, password, setPassword, loading, error, onSubmit } = useLoginFlow();

  return (
    <AuthCard
      title="Autenticación · Inicio de sesión"
      subtitle="Accede con tu usuario y contraseña."
    >
      <LoginForm
        username={username}
        onUsernameChange={setUsername}
        password={password}
        onPasswordChange={setPassword}
        loading={loading}
        error={error}
        onSubmit={onSubmit}
      />

      <div style={{ marginTop: 12, fontSize: 13, opacity: 0.8 }}>
        ¿Aún no tienes cuenta? <Link href="/login/registro">Regístrate</Link>
      </div>
    </AuthCard>
  );
}