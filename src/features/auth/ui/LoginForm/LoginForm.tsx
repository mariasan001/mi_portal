'use client';

import { Eye, EyeOff, KeyRound, User, ArrowRight, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import s from './LoginForm.module.css';

type Props = {
  username: string;
  onUsernameChange: (v: string) => void;

  password: string;
  onPasswordChange: (v: string) => void;

  loading?: boolean;
  error?: string | null;

  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
};

export default function LoginForm({
  username,
  onUsernameChange,
  password,
  onPasswordChange,
  loading = false,
  error,
  onSubmit,
}: Props) {
  const [showPass, setShowPass] = useState(false);

  return (
    <form className={s.form} onSubmit={onSubmit}>
      {error ? (
        <div className={s.alert}>
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
            placeholder="Tu usuario"
            autoComplete="username"
          />
        </div>
      </label>

      <label className={s.label}>
        <span className={s.labelText}>Contraseña</span>
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

      <button className={s.btn} disabled={loading || !username.trim() || !password}>
        <span>{loading ? 'Entrando…' : 'Iniciar sesión'}</span>
        <ArrowRight size={18} />
      </button>

      <p className={s.small}>
        Si entras desde un acceso rápido, tu app se selecciona automáticamente.
      </p>
    </form>
  );
}