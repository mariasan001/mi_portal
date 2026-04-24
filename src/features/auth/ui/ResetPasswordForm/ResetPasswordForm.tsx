'use client';

import { useEffect, useState } from 'react';
import {
  KeyRound,
  Mail,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react';

import { useResetPassword } from '@/features/auth/application/useResetPassword';

import s from './ResetPasswordForm.module.css';

type Props = {
  initialEmail?: string;
  initialOtp?: string;
  onBackToLogin: () => void;
  onSuccessToLogin: () => void;
};

export default function ResetPasswordForm({
  initialEmail = '',
  initialOtp = '',
  onBackToLogin,
  onSuccessToLogin,
}: Props) {
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(initialOtp);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { loading, error, ok, submit, reset } = useResetPassword();

  useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail]);

  useEffect(() => {
    setOtp(initialOtp);
  }, [initialOtp]);

  useEffect(() => {
    if (!ok) return;
    onSuccessToLogin();
  }, [ok, onSuccessToLogin]);

  useEffect(() => {
    reset();
  }, [email, otp, newPassword, reset]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await submit(email, otp, newPassword);
  }

  return (
    <form className={s.form} onSubmit={handleSubmit} aria-describedby="reset-hint" noValidate>
      <header className={s.head}>
        <span className={s.kicker}>Actualización de acceso</span>

        <div className={s.titleBlock}>
          <h1 className={s.title}>Crear nueva contraseña</h1>
          <p className={s.sub}>
            Confirma tu correo, ingresa el código de verificación y define una
            contraseña segura para recuperar tu acceso.
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
        <div className={s.alertOk} role="status" aria-live="polite">
          <CheckCircle2 size={16} aria-hidden="true" />
          <span>
            Contraseña actualizada correctamente. Regresando al inicio de sesión…
          </span>
        </div>
      ) : null}

      <div className={s.fields}>
        <label className={s.label}>
          <span className={s.labelText}>Correo electrónico</span>

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

        <label className={s.label}>
          <span className={s.labelText}>Nueva contraseña</span>

          <div className={s.inputWrap}>
            <span className={s.icon} aria-hidden="true">
              <KeyRound size={16} />
            </span>

            <input
              className={s.input}
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
            />

            <button
              type="button"
              className={s.eye}
              onClick={() => setShowPassword((x) => !x)}
              aria-label={
                showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
              }
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>
      </div>

      <div className={s.actions}>
        <button className={s.btnPrimary} type="submit" disabled={loading} aria-busy={loading}>
          <span className={s.btnText}>
            {loading ? 'Guardando…' : 'Guardar cambios'}
          </span>

          <span className={s.btnIconCircle} aria-hidden="true">
            <ArrowRight size={17} />
          </span>
        </button>

        <p className={s.loginRow}>
          <span className={s.loginText}>¿Quieres regresar?</span>{' '}
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
          Tus credenciales se utilizan únicamente para autenticar tu acceso y
          proteger tu información institucional.
        </p>
      </div>

      <p id="reset-hint" className={s.small}>
        Recomendación: usa una contraseña única y evita compartirla.
      </p>
    </form>
  );
}
