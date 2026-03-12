'use client';

import Link from 'next/link';
import {
  Eye,
  EyeOff,
  KeyRound,
  User,
  ArrowRight,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import s from './LoginForm.module.css';

type Props = {
  username: string;
  onUsernameChange: (v: string) => void;
  password: string;
  onPasswordChange: (v: string) => void;
  loading?: boolean;
  error?: string | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  forgotHref?: string;
  registerHref?: string;
};

function safeTrim(v: string) {
  return (v ?? '').trim();
}

export default function LoginForm({
  username,
  onUsernameChange,
  password,
  onPasswordChange,
  loading = false,
  error,
  onSubmit,
  forgotHref = '/login/password/forgot',
  registerHref = '/registro',
}: Props) {
  const [showPass, setShowPass] = useState(false);

  const forgotLink = useMemo(() => {
    const u = safeTrim(username);
    if (!u) return forgotHref;
    const qs = new URLSearchParams({ usernameOrEmail: u });
    return `${forgotHref}?${qs.toString()}`;
  }, [forgotHref, username]);

  const canSubmit =
    !loading && safeTrim(username).length > 0 && password.length > 0;

  return (
    <form className={s.form} onSubmit={onSubmit} aria-describedby="login-hint">
      <header className={s.head}>
        <span className={s.kicker}>Portal institucional</span>

        <div className={s.titleBlock}>
          <h1 className={s.title}>Accede al portal</h1>
          <p className={s.sub}>
            Consulta servicios, trámites y documentos desde un solo acceso institucional.
          </p>
        </div>
      </header>

      {error ? (
        <div className={s.alert} role="alert" aria-live="polite">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      ) : null}

      <div className={s.fields}>
        <label className={s.label}>
          <span className={s.labelText}>Usuario</span>

          <div className={s.inputWrap}>
            <span className={s.icon}>
              <User size={16} />
            </span>

            <input
              className={s.input}
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              placeholder="Tu usuario o correo"
              autoComplete="username"
            />
          </div>
        </label>

        <label className={s.label}>
          <div className={s.row}>
            <span className={s.labelText}>Contraseña</span>

            <Link className={s.forgot} href={forgotLink}>
              Recuperar acceso
            </Link>
          </div>

          <div className={s.inputWrap}>
            <span className={s.icon}>
              <KeyRound size={16} />
            </span>

            <input
              className={s.input}
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Tu contraseña"
              autoComplete="current-password"
            />

            <button
              type="button"
              className={s.eye}
              onClick={() => setShowPass((x) => !x)}
              aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>
      </div>
       <div className={s.actions}>
        <button className={s.btnPrimary} disabled={!canSubmit}>
          <span className={s.btnText}>
            {loading ? 'Entrando…' : 'Entrar al portal'}
          </span>
          <span className={s.btnIconCircle} aria-hidden="true">
            <ArrowRight size={17} />
          </span>
        </button>

        <p className={s.registerRow}>
          <span className={s.registerText}>¿No tienes cuenta?</span>{' '}
          <Link href={registerHref} className={s.registerLink}>
            Crear cuenta
          </Link>
        </p>
      </div>
      <div id="login-hint" className={s.securityNote}>
        <span className={s.securityIcon}>
          <ShieldCheck size={14} />
        </span>
        <p>Acceso protegido bajo estándares de seguridad institucional.</p>
      </div>
    </form>
  );
}