'use client';

import { useState } from 'react';
import {
  Eye,
  EyeOff,
  KeyRound,
  User,
  ArrowRight,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';

import s from './LoginForm.module.css';

type Props = {
  username: string;
  onUsernameChange: (v: string) => void;
  password: string;
  onPasswordChange: (v: string) => void;
  loading?: boolean;
  error?: string | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  onGoToForgot: () => void;
  onGoToRegister: () => void;
};

export default function LoginForm({
  username,
  onUsernameChange,
  password,
  onPasswordChange,
  loading = false,
  error,
  onSubmit,
  onGoToForgot,
  onGoToRegister,
}: Props) {
  const [showPass, setShowPass] = useState(false);

  return (
    <form
      className={s.form}
      onSubmit={onSubmit}
      aria-describedby="login-hint"
      noValidate
    >
      <header className={s.head}>
        <span className={s.kicker}>Portal institucional</span>

        <div className={s.titleBlock}>
          <h1 id="auth-modal-title" className={s.title}>
            Accede al portal
          </h1>
          <p className={s.sub}>
            Consulta servicios, tramites y documentos desde un solo acceso
            institucional.
          </p>
        </div>
      </header>

      {error ? (
        <div className={s.alert} role="alert" aria-live="polite">
          <AlertTriangle size={16} aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className={s.fields}>
        <label className={s.label}>
          <span className={s.labelText}>Usuario</span>

          <div className={s.inputWrap}>
            <span className={s.icon} aria-hidden="true">
              <User size={16} />
            </span>

            <input
              id="auth-username"
              className={s.input}
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              placeholder="Tu usuario o correo"
              autoComplete="username"
              data-autofocus="true"
            />
          </div>
        </label>

        <label className={s.label}>
          <span className={s.labelText}>Contrasena</span>

          <div className={s.inputWrap}>
            <span className={s.icon} aria-hidden="true">
              <KeyRound size={16} />
            </span>

            <input
              id="auth-password"
              className={s.input}
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Tu contrasena"
              autoComplete="current-password"
            />

            <button
              type="button"
              className={s.eye}
              onClick={() => setShowPass((x) => !x)}
              aria-label={showPass ? 'Ocultar contrasena' : 'Mostrar contrasena'}
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className={s.fieldMeta}>
            <button
              type="button"
              className={s.forgot}
              onClick={onGoToForgot}
            >
              Recuperar acceso
            </button>
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
            {loading ? 'Entrando...' : 'Entrar al portal'}
          </span>

          <span className={s.btnIconCircle} aria-hidden="true">
            <ArrowRight size={17} />
          </span>
        </button>

        <p className={s.registerRow}>
          <span className={s.registerText}>No tienes cuenta?</span>{' '}
          <button
            type="button"
            className={s.registerLink}
            onClick={onGoToRegister}
          >
            Crear cuenta
          </button>
        </p>
      </div>

      <div className={s.securityBlock}>
        <div id="login-hint" className={s.securityNote}>
          <span className={s.securityIcon} aria-hidden="true">
            <ShieldCheck size={14} />
          </span>
          <p>Acceso protegido bajo estandares de seguridad institucional.</p>
        </div>
      </div>
    </form>
  );
}
