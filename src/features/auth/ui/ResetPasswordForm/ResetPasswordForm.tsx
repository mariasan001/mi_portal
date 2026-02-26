'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { KeyRound, Mail, ShieldCheck } from 'lucide-react';

import { useResetPassword } from '@/features/auth/hooks/useResetPassword';

import s from './ResetPasswordForm.module.css';

type Props = {
  /** opcional: si quieres mostrar link a login */
  loginHref?: string;
};

function safeTrim(v: string) {
  return (v ?? '').trim();
}

export default function ResetPasswordForm({ loginHref = '/login' }: Props) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const { loading, error, ok, submit } = useResetPassword();

  const canSubmit = useMemo(() => {
    return !loading && safeTrim(email).length > 3 && safeTrim(otp).length > 0 && newPassword.length >= 8;
  }, [email, otp, newPassword, loading]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    await submit(email, otp, newPassword);
  }

  return (
    <form className={s.form} onSubmit={onSubmit} aria-describedby="reset-hint">
      <header className={s.head}>
        <h1 className={s.title}>Nueva contraseña</h1>
        <p className={s.sub}>Confirma tu correo, tu OTP y crea una contraseña segura.</p>
      </header>

      {error ? (
        <div className={s.alert} role="alert" aria-live="polite">
          {error}
        </div>
      ) : null}

      {ok ? (
        <div className={s.ok} role="status" aria-live="polite">
          Contraseña actualizada.{' '}
          <Link className={s.inlineLink} href={loginHref}>
            Ir a iniciar sesión
          </Link>
          .
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

      <label className={s.label}>
        <span className={s.labelText}>OTP</span>
        <div className={s.inputWrap}>
          <span className={s.icon} aria-hidden="true">
            <KeyRound size={16} />
          </span>
          <input
            className={s.input}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            inputMode="numeric"
          />
        </div>
      </label>

      <label className={s.label}>
        <span className={s.labelText}>Nueva contraseña</span>
        <div className={s.inputWrap}>
          <span className={s.icon} aria-hidden="true">
            <KeyRound size={16} />
          </span>
          <input
            className={s.input}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
          />
        </div>
      </label>

      <button className={s.btn} disabled={!canSubmit} aria-busy={loading}>
        {loading ? 'Guardando…' : 'Guardar nueva contraseña'}
      </button>

      <div className={s.notice} role="note" aria-label="Aviso de privacidad">
        <span className={s.noticeIcon} aria-hidden="true">
          <ShieldCheck size={16} />
        </span>
        <p className={s.noticeText}>
          Tus credenciales se usan solo para autenticar tu acceso y proteger tu información.
        </p>
      </div>

      <p id="reset-hint" className={s.small}>
        Tip: usa una contraseña única. Tu “12345678” no cuenta como estrategia de seguridad 😄
      </p>
    </form>
  );
}