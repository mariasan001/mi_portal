// src/features/auth/components/LoginForm/LoginForm.tsx
'use client';

import type { FormEvent } from 'react';
import { useId, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  LockKeyhole,
  User,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  Info,
  FileText,
} from 'lucide-react';

import s from './LoginForm.module.css';

type Props = {
  username: string;
  onUsernameChange: (v: string) => void;

  password: string;
  onPasswordChange: (v: string) => void;

  loading?: boolean;
  error?: string | null;

  onSubmit: (e: FormEvent<HTMLFormElement>) => void;

  forgotHref?: string;
  registerHref?: string;

  version?: string;
  builtBy?: string;
  privacyHref?: string;
};

export default function LoginForm({
  username,
  onUsernameChange,
  password,
  onPasswordChange,
  loading = false,
  error,
  onSubmit,
  forgotHref = '/recuperar-contrasena',
  registerHref = '/login/registro',
  version = 'v1.0.0',
  builtBy = 'Desarrollo Institucional',
  privacyHref = '/aviso-privacidad',
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const passwordId = useId();
  const usernameId = useId();

  const passType = useMemo(() => (showPassword ? 'text' : 'password'), [showPassword]);

  return (
    <section className={s.wrap}>
      <form className={s.card} onSubmit={onSubmit} aria-busy={loading}>
        {/* ✅ Bloquea inputs y botones si está cargando */}
        <fieldset className={s.fieldset} disabled={loading}>
          <header className={s.header}>
            <div className={s.brandIcon} aria-hidden="true">
              <LockKeyhole size={18} />
            </div>

            <div className={s.brandText}>
              <h1 className={s.brandTitle}>Portal de Servicios</h1>
              <p className={s.brandSub}>
                Inicia sesión para continuar con tus trámites y servicios.
              </p>
            </div>
          </header>

          <div className={s.badges} aria-label="Seguridad y privacidad">
            <span className={s.badge}>
              <ShieldCheck size={14} aria-hidden="true" />
              Acceso institucional
            </span>

            <span className={s.badge}>
              <KeyRound size={14} aria-hidden="true" />
              Datos protegidos
            </span>
          </div>

          <label className={s.label} htmlFor={usernameId}>
            Usuario
            <div className={s.inputWrap}>
              <User className={s.inputIcon} size={16} aria-hidden="true" />
              <input
                id={usernameId}
                name="username"
                className={s.input}
                value={username}
                onChange={(e) => onUsernameChange(e.target.value)}
                autoComplete="username"
                inputMode="text"
                placeholder="Escribe tu usuario"
                aria-invalid={Boolean(error) || undefined}
              />
            </div>
          </label>

          <label className={s.label} htmlFor={passwordId}>
            Contraseña
            <div className={s.inputWrap}>
              <KeyRound className={s.inputIcon} size={16} aria-hidden="true" />
              <input
                id={passwordId}
                name="password"
                type={passType}
                className={s.input}
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                aria-invalid={Boolean(error) || undefined}
              />

              <button
                type="button"
                className={s.passToggle}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                aria-pressed={showPassword}
                title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  <EyeOff size={16} aria-hidden="true" />
                ) : (
                  <Eye size={16} aria-hidden="true" />
                )}
              </button>
            </div>
          </label>

          {error ? (
            <div className={s.error} role="alert">
              <div className={s.errorTitle}>No pudimos iniciar sesión</div>
              <div className={s.errorMsg}>{error}</div>
            </div>
          ) : null}

          <button className={s.btn} type="submit">
            <span>{loading ? 'Entrando…' : 'Iniciar sesión'}</span>
            <ArrowRight size={16} aria-hidden="true" />
          </button>

          <nav className={s.linksRow} aria-label="Acciones">
            <Link className={s.link} href={forgotHref}>
              Recuperar contraseña
            </Link>
            <span className={s.dot} aria-hidden="true">•</span>
            <Link className={s.linkStrong} href={registerHref}>
              Nuevo registro
            </Link>
          </nav>

          {/* ✅ Aviso institucional */}
          <div className={s.notice} role="note" aria-label="Aviso de privacidad y uso">
            <div className={s.noticeIcon} aria-hidden="true">
              <Info size={16} />
            </div>

            <div className={s.noticeText}>
              <p className={s.noticeTitle}>Privacidad y uso del sistema</p>
              <p className={s.noticeBody}>
                Acceso exclusivo para personal autorizado. La información capturada se utiliza
                únicamente para la operación de los servicios y se protege conforme al aviso de
                privacidad vigente.
              </p>

              <div className={s.noticeLinks}>
                <Link className={s.noticeLink} href={privacyHref}>
                  <FileText size={14} aria-hidden="true" />
                  Ver aviso de privacidad
                </Link>
              </div>
            </div>
          </div>

          {/* ✅ Footer meta */}
          <footer className={s.meta} aria-label="Información del sistema">
            <span className={s.metaItem}>
              <span className={s.metaLabel}>Versión:</span> {version}
            </span>
            <span className={s.metaDot} aria-hidden="true">•</span>
            <span className={s.metaItem}>
              <span className={s.metaLabel}>Desarrollado por:</span> {builtBy}
            </span>
          </footer>
        </fieldset>
      </form>
    </section>
  );
}