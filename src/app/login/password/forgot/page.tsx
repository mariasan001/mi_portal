'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Mail, ArrowRight, AlertTriangle, Info } from 'lucide-react';

import { useForgotPassword } from '@/features/auth/hooks/useForgotPassword';

import s from './ForgotPasswordPage.module.css';

function safeTrim(v: string) {
  return (v ?? '').trim();
}

export default function ForgotPasswordPage() {
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
    await submit(email);
  }

  return (

      <form className={s.form} onSubmit={onSubmit}>
        {error ? (
          <div className={s.alert} role="alert" aria-live="polite">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        ) : null}

        {ok ? (
          <div className={s.info} role="status" aria-live="polite">
            <Info size={16} />
            <span>
              Si el correo existe, te enviamos un OTP. Continúa a{' '}
              <Link className={s.inlineLink} href="login/password/otp">
                validar OTP
              </Link>
              .
            </span>
          </div>
        ) : null}

        <label className={s.label}>
          <span className={s.labelText}>Correo</span>

          <div className={s.inputWrap}>
            <span className={s.icon}>
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

        <button className={s.btn} disabled={!canSubmit}>
          <span>{loading ? 'Enviando…' : 'Enviar OTP'}</span>
          <ArrowRight size={18} />
        </button>

        <div className={s.footer}>
          <Link className={s.back} href="/login">
            Volver a iniciar sesión
          </Link>
        </div>

        <p className={s.small}>
          Tip: Por seguridad, el sistema siempre responde “OK” aunque el correo no exista. Así nadie anda de chismoso.
        </p>
      </form>
  );
}