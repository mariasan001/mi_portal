'use client';

import { useEffect, useState } from 'react';
import {
  Mail,
  KeyRound,
  ArrowRight,
  AlertTriangle,
  Info,
  ShieldCheck,
} from 'lucide-react';

import { useVerifyOtp } from '@/features/auth/application/useVerifyOtp';

import s from './VerifyOtpForm.module.css';

type Props = {
  /**
   * Prefill del correo/usuario recibido desde forgot.
   */
  initialUsernameOrEmail?: string;

  /**
   * Navegación interna del modal.
   */
  onBackToForgot: () => void;
  onGoToReset: (identifier: string, otp: string) => void;
};

function safeTrim(v: string) {
  return (v ?? '').trim();
}

export default function VerifyOtpForm({
  initialUsernameOrEmail = '',
  onBackToForgot,
  onGoToReset,
}: Props) {
  const [usernameOrEmail, setUsernameOrEmail] = useState(initialUsernameOrEmail);
  const [otp, setOtp] = useState('');

  const { loading, error, ok, submit, reset } = useVerifyOtp();

  useEffect(() => {
    setUsernameOrEmail(initialUsernameOrEmail);
  }, [initialUsernameOrEmail]);

  useEffect(() => {
    if (!ok) return;

    onGoToReset(safeTrim(usernameOrEmail), safeTrim(otp));
  }, [ok, usernameOrEmail, otp, onGoToReset]);

  useEffect(() => {
    reset();
  }, [usernameOrEmail, otp, reset]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await submit(usernameOrEmail, otp, 'PASSWORD_RESET');
  }

  function handleContinue() {
    onGoToReset(safeTrim(usernameOrEmail), safeTrim(otp));
  }

  return (
    <form
      className={s.form}
      onSubmit={handleSubmit}
      aria-describedby="otp-hint"
      noValidate
    >
      <header className={s.head}>
        <span className={s.kicker}>Verificación de identidad</span>

        <div className={s.titleBlock}>
          <h1 className={s.title}>Validar código</h1>
          <p className={s.sub}>
            Ingresa el código de verificación enviado a tu correo para continuar
            con la recuperación de tu acceso.
          </p>
        </div>
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
          <span>Código válido. Continuando al siguiente paso…</span>
        </div>
      ) : null}

      <div className={s.fields}>
        <label className={s.label}>
          <div className={s.row}>
            <span className={s.labelText}>Usuario o correo</span>

            <button
              type="button"
              className={s.secondaryLink}
              onClick={onBackToForgot}
            >
              Reenviar código
            </button>
          </div>

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
      </div>

      <div className={s.actions}>
        <button
          className={s.btnPrimary}
          type="submit"
          disabled={loading}
          aria-busy={loading}
        >
          <span className={s.btnText}>
            {loading ? 'Validando…' : 'Validar código'}
          </span>

          <span className={s.btnIconCircle} aria-hidden="true">
            <ArrowRight size={17} />
          </span>
        </button>

        <p className={s.loginRow}>
          <span className={s.loginText}>¿Ya lo verificaste?</span>{' '}
          <button
            type="button"
            className={s.loginLink}
            onClick={handleContinue}
          >
            Continuar
          </button>
        </p>
      </div>

      <div className={s.securityNote} role="note" aria-label="Seguridad">
        <span className={s.securityIcon} aria-hidden="true">
          <ShieldCheck size={14} />
        </span>

        <p>
          El código es temporal y forma parte del proceso de validación para
          proteger el acceso a tu cuenta.
        </p>
      </div>

      <p id="otp-hint" className={s.small}>
        Si no lo encuentras, revisa spam o promociones.
      </p>
    </form>
  );
}
