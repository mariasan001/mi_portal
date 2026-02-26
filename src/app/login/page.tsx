'use client';

import { AuthSplitLayout, LoginForm, useLoginFlow } from '@/features/auth';
import Link from 'next/link';

export default function LoginPage() {
  const { username, setUsername, password, setPassword, loading, error, onSubmit } = useLoginFlow();

  return (
    <AuthSplitLayout
      leftTitle="Entra a tu cuenta y gestiona tus servicios."
      leftDescription="Accede con tu usuario y contraseña. Sin atajos raros: aquí lo importante es que funcione y sea seguro."
      bottomLeft={
        <>
          ¿Nuevo?{' '}
          <Link href="/login/registro">
            Crear cuenta
          </Link>
        </>
      }
      bottomRight={
        <Link href="/privacidad">
          Aviso de privacidad
        </Link>
      }
    >
      <LoginForm
        username={username}
        onUsernameChange={setUsername}
        password={password}
        onPasswordChange={setPassword}
        loading={loading}
        error={error}
        onSubmit={onSubmit}
        forgotHref="/login/password/forgot"
      />
    </AuthSplitLayout>
  );
}