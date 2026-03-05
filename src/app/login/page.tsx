'use client';

import { AuthSplitLayout, LoginForm, useLoginFlow } from '@/features/auth';
import Link from 'next/link';

export default function LoginPage() {
  const { username, setUsername, password, setPassword, loading, error, onSubmit } = useLoginFlow();

  return (
    <AuthSplitLayout
      leftTitle="Consulta y descarga tus comprobantes oficiales."
      leftDescription="Accede para emitir, consultar y descargar comprobantes de percepciones y deducciones por periodo. Todo en un solo lugar, sin vueltas."
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