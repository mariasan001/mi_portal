'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLoginFlow } from '@/features/auth';
import s from './login.module.css';
import LoginForm from '@/features/auth/ui/LoginForm/LoginForm';

export default function LoginPage() {
  const { username, setUsername, password, setPassword, loading, error, onSubmit } = useLoginFlow();

  return (
    <main className={s.page}>
      <div className={s.container}>
        {/* IZQUIERDA */}
        <section className={s.leftPanel} aria-hidden="true">
          <div className={s.leftContent}>
            <div className={s.leftTag}>Portal de Servicios</div>
            <h1 className={s.leftTitle}>Entra a tu cuenta y gestiona tus servicios.</h1>
            <p className={s.leftSub}>
              Accede con tu usuario y contraseña. Sin atajos raros: aquí lo importante es que funcione y sea seguro.
            </p>
            <div className={s.leftFoot}>© 2026 Gobierno del Estado de México</div>
          </div>
        </section>

        {/* DERECHA */}
        <section className={s.rightPanel}>
          {/* logo PEGADO arriba */}
          <div className={s.logoBox}>
            <Image src="/img/logo_principal.png" alt="Logo institucional" width={130} height={50} priority />
          </div>

          {/* contenido CENTRADO */}
          <div className={s.rightCenter}>
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

            <div className={s.metaRow}>
              <span>
                ¿Nuevo?{' '}
                <Link className={s.metaLink} href="/login/registro">
                  Crear cuenta
                </Link>
              </span>

              <Link className={s.metaMuted} href="/privacidad">
                Aviso de privacidad
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}