'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Mail, ArrowRight, AlertTriangle, Info, ShieldCheck } from 'lucide-react';

import { useForgotPassword } from '@/features/auth/hooks/useForgotPassword';

import s from './ForgotPasswordForm.module.css';

type Props = {
  otpHref?: string;     // a dónde mandar a validar OTP
  loginHref?: string;   // volver a login
};

function safeTrim(v: string) {
  return (v ?? '').trim();
}

export default function ForgotPasswordForm({
  otpHref = '/login/password/otp',
  loginHref = '/login',
}: Props) {
  const [email, setEmail] = useState('');
  const { loading, error, ok, submit } = useForgotPassword();

  // ✅ prefill desde LoginForm: /password/forgot?usernameOrEmail=...
  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const v = sp.get('usernameOrEmail')?.trim();
      if (v) setEmail(v);
    } catch {
      // noop
    }
  }, []);

  const canSubmit = useMemo(() => safeTrim(email).length > 3 && !loading, [email, loading]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    await submit(email);
  }

  return (
    <form className={s.form} onSubmit={onSubmit} aria-describedby="forgot-hint">
      <header className={s.head}>
        <h1 className={s.title}>Recuperar contraseña</h1>
        <p className={s.sub}>Escribe tu correo y te enviaremos un OTP para continuar.</p>
      </header>

      {error ? (
        <div className={s.alert} role="alert" aria-live="polite">
          <AlertTriangle size={16} aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : null}

      {ok ? (
        <div className={s.info} role="status" aria-live="polite">
          <Info size={16} aria-hidden="true" />
          <span>
            Si el correo existe, te enviamos un OTP. Continúa a{' '}
            <Link className={s.inlineLink} href={otpHref}>
              validar OTP
            </Link>
            .
          </span>
        </div>
      ) : null}

      <label className={s.label}>
        <span className={s.labelText}>Correo</span>
        <div className={s.inputWrap}>
          <span className={s.icon} aria-hidden="true">
            <Mail size={16} />
          </span>

          <input
            className={s.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            autoComplete="email"
            inputMode="email"
          />
        </div>
      </label>

      <button className={s.btn} disabled={!canSubmit} aria-busy={loading}>
        <span>{loading ? 'Enviando…' : 'Enviar OTP'}</span>
        <ArrowRight size={18} aria-hidden="true" />
      </button>

      <div className={s.footerRow}>
        <Link className={s.back} href={loginHref}>
          Volver a iniciar sesión
        </Link>

        <Link className={s.next} href={otpHref}>
          Ya tengo OTP
        </Link>
      </div>

      <div className={s.notice} role="note" aria-label="Seguridad">
        <span className={s.noticeIcon} aria-hidden="true">
          <ShieldCheck size={16} />
        </span>
        <p className={s.noticeText}>
          Por seguridad, el sistema puede responder “OK” aunque el correo no exista.
          Así evitamos que alguien “adivine” usuarios.
        </p>
      </div>

      <p id="forgot-hint" className={s.small}>
        Tip: revisa spam/promociones. A veces el OTP se va de vacaciones 😄
      </p>
    </form>
  );
}