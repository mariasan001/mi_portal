'use client';

import { useMemo, useState } from 'react';
import { Eye, EyeOff, UserPlus, Mail, Phone, BriefcaseBusiness, Hash } from 'lucide-react';
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

export function RegisterForm({ value, onChange, onSubmit, loading = false, error, success }: Props) {
  const [showPass, setShowPass] = useState(false);

  const localError = useMemo(() => {
    if (!value.claveSp.trim()) return 'Ingresa tu Clave SP.';
    if (!value.plaza.trim()) return 'Ingresa tu Plaza.';
    if (!value.puesto.trim()) return 'Ingresa tu Puesto.';
    if (!value.email.trim() || !isValidEmail(value.email)) return 'Ingresa un email válido.';
    if (value.password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
    if (!value.phone.trim()) return 'Ingresa tu teléfono.';
    return null;
  }, [value]);

  const disabled = loading || !!localError;

  return (
    <div className={s.root}>
      {(error || success) && (
        <div className={error ? s.alertError : s.alertOk}>
          <b>{error ? 'Ojo:' : 'Listo:'}</b> {error ?? success}
        </div>
      )}

      <div className={s.grid}>
        <Field
          label="Clave SP"
          icon={<Hash size={16} />}
          value={value.claveSp}
          onChange={(v) => onChange('claveSp', v)}
          placeholder="Ej: 210048332"
        />

        <Field
          label="Plaza"
          icon={<Hash size={16} />}
          value={value.plaza}
          onChange={(v) => onChange('plaza', v)}
          placeholder="Ej: 234000000002125"
        />

        <Field
          label="Puesto"
          icon={<BriefcaseBusiness size={16} />}
          value={value.puesto}
          onChange={(v) => onChange('puesto', v)}
          placeholder="Ej: ANALISTA ESPECIALIZADO B"
        />

        <Field
          label="Correo"
          icon={<Mail size={16} />}
          value={value.email}
          onChange={(v) => onChange('email', v)}
          placeholder="nombre@dominio.gob.mx"
        />

        <div className={s.passRow}>
          <label className={s.label}>
            <span className={s.labelText}>Contraseña</span>
            <div className={s.inputWrap}>
              <span className={s.icon}><UserPlus size={16} /></span>
              <input
                className={s.input}
                type={showPass ? 'text' : 'password'}
                value={value.password}
                onChange={(e) => onChange('password', e.target.value)}
                placeholder="Mínimo 8 caracteres"
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

        <Field
          label="Teléfono"
          icon={<Phone size={16} />}
          value={value.phone}
          onChange={(v) => onChange('phone', v)}
          placeholder="Ej: 7221234567"
        />
      </div>

      {localError && !error && <p className={s.hint}>• {localError}</p>}

      <button className={s.btn} onClick={onSubmit} disabled={disabled}>
        {loading ? 'Registrando…' : 'Crear cuenta'}
      </button>

      <p className={s.small}>
        Al crear tu cuenta, validamos Clave SP + Plaza + Puesto contra CORE y generamos tu acceso.
      </p>
    </div>
  );
}

function Field(props: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className={s.label}>
      <span className={s.labelText}>{props.label}</span>
      <div className={s.inputWrap}>
        <span className={s.icon}>{props.icon}</span>
        <input
          className={s.input}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
        />
      </div>
    </label>
  );
}