// src/features/auth/ui/RegisterForm/RegisterForm.tsx
'use client';

import { useMemo, useState } from 'react';
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
} from 'lucide-react';

import s from './RegisterForm.module.css';
import type { RegisterPayload } from '../../types/register.types';

type Props = {
  value: RegisterPayload;
  onChange: <K extends keyof RegisterPayload>(key: K, value: RegisterPayload[K]) => void;
  onSubmit: () => void;
  loading?: boolean;
  error?: string | null;
  success?: string | null;
};

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function safeTrim(v: string) {
  return (v ?? '').trim();
}

export function RegisterForm({ value, onChange, onSubmit, loading = false, error, success }: Props) {
  const [showPass, setShowPass] = useState(false);

  const localError = useMemo(() => {
    if (!safeTrim(value.plaza)) return 'Ingresa tu Plaza.';
    if (!safeTrim(value.puesto)) return 'Ingresa tu Puesto.';
    if (!safeTrim(value.email) || !isValidEmail(value.email)) return 'Ingresa un correo válido.';
    if ((value.password ?? '').length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
    if (!safeTrim(value.phone)) return 'Ingresa tu teléfono.';
    return null;
  }, [value]);

  const disabled = loading || !!localError;

  return (
    <div className={s.root}>
      {/* ✅ HEADER (lo que faltaba) */}
      <header className={s.head}>
        <h1 className={s.title}>Crea tu cuenta</h1>
        <p className={s.sub}>
          Registra tus datos para generar tu acceso. La validación se realiza con información institucional.
        </p>
      </header>

      {(error || success) ? (
        <div className={error ? s.alertError : s.alertOk} role="alert" aria-live="polite">
          {error ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
          <span><b>{error ? 'Ojo:' : 'Listo:'}</b> {error ?? success}</span>
        </div>
      ) : null}

      <div className={s.grid}>
        {/* Row: Clave / Plaza */}
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
            placeholder="Ej: 234000000002125"
            inputMode="numeric"
            autoComplete="off"
          />
        </div>

        {/* Full: Puesto */}
        <div className={s.full}>
          <Field
            label="Puesto"
            icon={<BriefcaseBusiness size={16} />}
            value={value.puesto}
            onChange={(v) => onChange('puesto', v)}
            placeholder="Ej: ANALISTA ESPECIALIZADO B"
            autoComplete="organization-title"
          />
        </div>

        {/* Full: Correo */}
        <div className={s.full}>
          <Field
            label="Correo"
            icon={<Mail size={16} />}
            value={value.email}
            onChange={(v) => onChange('email', v)}
            placeholder="nombre@dominio.gob.mx"
            type="email"
            autoComplete="email"
          />
        </div>

        {/* Row: Password / Teléfono */}
        <div className={s.row2}>
          <label className={s.label}>
            <span className={s.labelText}>Contraseña</span>
            <div className={s.inputWrap}>
              <span className={s.icon}>
                <KeyRound size={16} />
              </span>

              <input
                className={s.input}
                type={showPass ? 'text' : 'password'}
                value={value.password}
                onChange={(e) => onChange('password', e.target.value)}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
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

          <Field
            label="Teléfono"
            icon={<Phone size={16} />}
            value={value.phone}
            onChange={(v) => onChange('phone', v)}
            placeholder="Ej: 7221234567"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
          />
        </div>
      </div>

      {localError && !error ? <p className={s.hint}>• {localError}</p> : null}

      <button type="button" className={s.btn} onClick={onSubmit} disabled={disabled}>
        {loading ? 'Registrando…' : 'Crear cuenta'}
      </button>

   
    </div>
  );
}

function Field(props: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  autoComplete?: string;
}) {
  return (
    <label className={s.label}>
      <span className={s.labelText}>{props.label}</span>
      <div className={s.inputWrap}>
        <span className={s.icon}>{props.icon}</span>
        <input
          className={s.input}
          type={props.type ?? 'text'}
          inputMode={props.inputMode}
          autoComplete={props.autoComplete}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
        />
      </div>
    </label>
  );
}