'use client';

import { useEffect, useState } from 'react';
import {
  Mail,
  ArrowRight,
  AlertTriangle,
  Info,
  ShieldCheck,
} from 'lucide-react';

import { useForgotPassword } from '@/features/auth/hooks/useForgotPassword';

import s from './ForgotPasswordForm.module.css';

type Props = {
  initialEmail?: string;
  onBackToLogin: () => void;
  onGoToOtp: (email: string) => void;
};

function safeTrim(v: string) {
  return (v ?? '').trim();
}

export default function ForgotPasswordForm({
  initialEmail = '',
  onBackToLogin,
  onGoToOtp,
}: Props) {
  const [email, setEmail] = useState(initialEmail);
  const { loading, error, ok, submit, reset } = useForgotPassword();

  useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail]);

  useEffect(() => {
    if (!ok) return;
    onGoToOtp(safeTrim(email));
  }, [ok, email, onGoToOtp]);

  useEffect(() => {
    reset();
  }, [email, reset]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await submit(email);
  }

  function handleGoToOtp() {
    onGoToOtp(safeTrim(email));
  }

  return (
    <form
      className={s.form}
      onSubmit={handleSubmit}
      aria-describedby="forgot-hint"
      noValidate
    >
      <header className={s.head}>
        <span className={s.kicker}>Recuperación de acceso</span>

        <div className={s.titleBlock}>
          <h1 className={s.title}>Restablecer contraseña</h1>
          <p className={s.sub}>
            Ingresa tu correo institucional para recibir un código de verificación
            y continuar con la recuperación de tu acceso.
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
          <span>
            Si el correo está registrado, enviaremos un código de verificación.
            Continuando al siguiente paso…
          </span>
        </div>
      ) : null}

      <div className={s.fields}>
        <label className={s.label}>
          <div className={s.row}>
            <span className={s.labelText}>Correo electrónico</span>

            <button
              type="button"
              className={s.secondaryLink}
              onClick={handleGoToOtp}
            >
              Ya tengo código
            </button>
          </div>

          <div className={s.inputWrap}>
            <span className={s.icon} aria-hidden="true">
              <Mail size={16} />
            </span>

            <input
              className={s.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@dominio.gob.mx"
              autoComplete="email"
              inputMode="email"
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
            {loading ? 'Enviando…' : 'Enviar código'}
          </span>

          <span className={s.btnIconCircle} aria-hidden="true">
            <ArrowRight size={17} />
          </span>
        </button>

        <p className={s.loginRow}>
          <span className={s.loginText}>¿Recordaste tu acceso?</span>{' '}
          <button
            type="button"
            className={s.loginLink}
            onClick={onBackToLogin}
          >
            Volver al inicio de sesión
          </button>
        </p>
      </div>

      <div className={s.securityNote} role="note" aria-label="Seguridad">
        <span className={s.securityIcon} aria-hidden="true">
          <ShieldCheck size={14} />
        </span>

        <p>
          Por seguridad, la respuesta puede ser la misma aunque el correo no
          exista. Esto ayuda a proteger la información de las cuentas.
        </p>
      </div>

      <p id="forgot-hint" className={s.small}>
        Revisa tu bandeja de entrada y también spam o promociones.
      </p>
    </form>
  );
}