// src/features/auth/ui/VerifyOtpForm/VerifyOtpForm.tsx
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Mail, KeyRound, ArrowRight, AlertTriangle, Info } from 'lucide-react';

import { useVerifyOtp } from '@/features/auth/hooks/useVerifyOtp';

import s from './VerifyOtpForm.module.css';

type Props = {
  resetHref?: string;
  resendHref?: string;
};

function safeTrim(v: string) {
  return (v ?? '').trim();
}

export default function VerifyOtpForm({
  resetHref = '/login/password/reset',
  resendHref = '/login/password/forgot',
}: Props) {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [otp, setOtp] = useState('');

  const { loading, error, ok, submit } = useVerifyOtp();

  // ✅ prefill desde forgot: ?usernameOrEmail=...
  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const v = sp.get('usernameOrEmail')?.trim();
      if (v) setUsernameOrEmail(v);
    } catch {
      // noop
    }
  }, []);

  const canSubmit = useMemo(() => {
    return !loading && safeTrim(usernameOrEmail).length > 2 && safeTrim(otp).length > 3;
  }, [loading, usernameOrEmail, otp]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    await submit(usernameOrEmail, otp, 'PASSWORD_RESET');
  }

  return (
    <form className={s.form} onSubmit={onSubmit} aria-describedby="otp-hint">
      <header className={s.head}>
        <h1 className={s.title}>Validar código</h1>
        <p className={s.sub}>
          Ingresa el código de verificación enviado a tu correo para continuar.
        </p>
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
            Código válido. Continúa a{' '}
            <Link className={s.inlineLink} href={resetHref}>
              restablecer contraseña
            </Link>
            .
          </span>
        </div>
      ) : null}

      <label className={s.label}>
        <span className={s.labelText}>Usuario o correo</span>
        <div className={s.inputWrap}>
          <span className={s.icon} aria-hidden="true">
            <Mail size={16} />
          </span>
          <input
            className={s.input}
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            placeholder="usuario o correo"
            autoComplete="username"
          />
        </div>
      </label>

      <label className={s.label}>
        <span className={s.labelText}>Código de verificación</span>
        <div className={s.inputWrap}>
          <span className={s.icon} aria-hidden="true">
            <KeyRound size={16} />
          </span>
          <input
            className={s.input}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Ej: 123456"
            inputMode="numeric"
            autoComplete="one-time-code"
          />
        </div>
      </label>

      <button className={s.btn} disabled={!canSubmit} aria-busy={loading}>
        <span>{loading ? 'Validando…' : 'Validar código'}</span>
        <ArrowRight size={18} aria-hidden="true" />
      </button>

      <div className={s.footerRow}>
        <Link className={s.back} href={resendHref}>
          Reenviar código
        </Link>

        <Link className={s.next} href={resetHref}>
          Continuar
        </Link>
      </div>

      <p id="otp-hint" className={s.small}>
        Si no lo encuentras, revisa spam o promociones.
      </p>
    </form>
  );
}