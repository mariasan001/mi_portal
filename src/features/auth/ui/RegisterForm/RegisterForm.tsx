'use client';

import { useState } from 'react';
import {
  Eye,
  EyeOff,
  Mail,
  Phone,
  BriefcaseBusiness,
  Hash,
  KeyRound,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

import s from './RegisterForm.module.css';
import type { RegisterPayload } from '../../model/register.types';

type Props = {
  value: RegisterPayload;
  onChange: <K extends keyof RegisterPayload>(
    key: K,
    value: RegisterPayload[K]
  ) => void;
  onSubmit: () => void;
  loading?: boolean;
  error?: string | null;
  success?: string | null;
  onBackToLogin: () => void;
};

export default function RegisterForm({
  value,
  onChange,
  onSubmit,
  loading = false,
  error,
  success,
  onBackToLogin,
}: Props) {
  const [showPass, setShowPass] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form
      className={s.form}
      onSubmit={handleSubmit}
      aria-describedby="register-hint"
      noValidate
    >
      <header className={s.head}>
        <span className={s.kicker}>Registro institucional</span>

        <div className={s.titleBlock}>
          <h1 className={s.title}>Crea tu cuenta</h1>
          <p className={s.sub}>
            Completa tus datos institucionales para habilitar tu acceso al
            portal.
          </p>
        </div>
      </header>

      {error || success ? (
        <div
          className={error ? s.alertError : s.alertOk}
          role="alert"
          aria-live="polite"
        >
          {error ? (
            <AlertTriangle size={16} aria-hidden="true" />
          ) : (
            <CheckCircle2 size={16} aria-hidden="true" />
          )}

          <span>{error ?? success}</span>
        </div>
      ) : null}

      <div className={s.fields}>
        <div className={s.row2}>
          <Field
            label="Clave SP"
            icon={<Hash size={16} />}
            value={value.claveSp}
            onChange={(v) => onChange('claveSp', v)}
            placeholder="Ej: 210048332"
            inputMode="numeric"
            autoComplete="off"
          />

          <Field
            label="Plaza"
            icon={<Hash size={16} />}
            value={value.plaza}
            onChange={(v) => onChange('plaza', v)}
            placeholder="Ej: 234000..."
            inputMode="numeric"
            autoComplete="off"
          />
        </div>

        <Field
          label="Puesto"
          icon={<BriefcaseBusiness size={16} />}
          value={value.puesto}
          onChange={(v) => onChange('puesto', v)}
          placeholder="Puesto institucional"
          autoComplete="organization-title"
        />

        <Field
          label="Correo institucional"
          icon={<Mail size={16} />}
          value={value.email}
          onChange={(v) => onChange('email', v)}
          placeholder="nombre@dominio.gob.mx"
          type="email"
          autoComplete="email"
        />

        <div className={s.row2}>
          <label className={s.label}>
            <span className={s.labelText}>Contrasena</span>

            <div className={s.inputWrap}>
              <span className={s.icon} aria-hidden="true">
                <KeyRound size={16} />
              </span>

              <input
                className={s.input}
                type={showPass ? 'text' : 'password'}
                value={value.password}
                onChange={(e) => onChange('password', e.target.value)}
                placeholder="Minimo 8 caracteres"
                autoComplete="new-password"
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
          </label>

          <Field
            label="Telefono"
            icon={<Phone size={16} />}
            value={value.phone}
            onChange={(v) => onChange('phone', v)}
            placeholder="7221234567"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
          />
        </div>
      </div>

      <div className={s.actions}>
        <button className={s.btnPrimary} type="submit" disabled={loading}>
          <span className={s.btnText}>
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </span>

          <span className={s.btnIconCircle} aria-hidden="true">
            <ArrowRight size={17} />
          </span>
        </button>

        <p className={s.loginRow}>
          <span className={s.loginText}>Ya tienes acceso?</span>{' '}
          <button
            type="button"
            className={s.loginLink}
            onClick={onBackToLogin}
          >
            Iniciar sesion
          </button>
        </p>
      </div>

      <div className={s.securityBlock}>
        <div id="register-hint" className={s.securityNote}>
          <span className={s.securityIcon} aria-hidden="true">
            <ShieldCheck size={14} />
          </span>

          <p>
            Tus datos se validan bajo lineamientos de seguridad institucional.
          </p>
        </div>
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  autoComplete?: string;
};

function Field({
  label,
  icon,
  value,
  onChange,
  placeholder,
  type = 'text',
  inputMode,
  autoComplete,
}: FieldProps) {
  return (
    <label className={s.label}>
      <span className={s.labelText}>{label}</span>

      <div className={s.inputWrap}>
        <span className={s.icon} aria-hidden="true">
          {icon}
        </span>

        <input
          className={s.input}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </label>
  );
}
