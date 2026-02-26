'use client';

import Link from 'next/link';
import { Eye, EyeOff, KeyRound, User, ArrowRight, AlertTriangle } from 'lucide-react';
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
  forgotHref = '/login/password/forgot', // ✅ fix
}: Props) {
  const [showPass, setShowPass] = useState(false);

  const forgotLink = useMemo(() => {
    const u = safeTrim(username);
    if (!u) return forgotHref;
    const qs = new URLSearchParams({ usernameOrEmail: u });
    return `${forgotHref}?${qs.toString()}`;
  }, [forgotHref, username]);

  const canSubmit = !loading && safeTrim(username).length > 0 && password.length > 0;

  return (
    <form className={s.form} onSubmit={onSubmit} aria-describedby="login-hint">
      <header className={s.head}>
        <h1 className={s.title}>Inicia sesión</h1>
        <p className={s.sub}>Accede con tu usuario y contraseña para continuar.</p>
      </header>

      {error ? (
        <div className={s.alert} role="alert" aria-live="polite">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      ) : null}

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
            ¿Olvidaste tu contraseña?
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

      <button className={s.btn} disabled={!canSubmit}>
        <span>{loading ? 'Entrando…' : 'Iniciar sesión'}</span>
        <ArrowRight size={18} />
      </button>

      <p id="login-hint" className={s.small}>
        Si entras desde un acceso rápido, tu app se selecciona automáticamente.
      </p>
    </form>
  );
}