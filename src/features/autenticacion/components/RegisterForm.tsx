// src/features/auth/components/RegisterForm/RegisterForm.tsx
'use client';

import Link from 'next/link';
import { useId, useMemo, useState } from 'react';
import {
  UserPlus,
  BadgeCheck,
  Mail,
  KeyRound,
  Phone,
  BriefcaseBusiness,
  Hash,
  Eye,
  EyeOff,
  ArrowRight,
  Info,
} from 'lucide-react';

import s from './RegisterForm.module.css';

type RegisterPayload = {
  claveSp: string;
  plaza: string;
  puesto: string;
  email: string;
  password: string;
  phone: string;
};

type Props = {
  value: RegisterPayload;
  onChange: <K extends keyof RegisterPayload>(key: K, value: RegisterPayload[K]) => void;
  onSubmit: () => void;
  loading?: boolean;
  error?: string | null;
  loginHref?: string;
};

export default function RegisterForm({
  value,
  onChange,
  onSubmit,
  loading = false,
  error,
  loginHref = '/login',
}: Props) {
  const [showPass, setShowPass] = useState(false);

  const claveId = useId();
  const plazaId = useId();
  const puestoId = useId();
  const emailId = useId();
  const passId = useId();
  const phoneId = useId();

  const passType = useMemo(() => (showPass ? 'text' : 'password'), [showPass]);

  return (
    <section className={s.wrap}>
      <div className={s.card}>
        <header className={s.header}>
          <div className={s.brandIcon} aria-hidden="true">
            <UserPlus size={18} />
          </div>

          <div className={s.brandText}>
            <h1 className={s.brandTitle}>Nuevo registro</h1>
            <p className={s.brandSub}>
              Captura tus datos exactamente como están en tu información institucional.
            </p>
          </div>
        </header>

        <div className={s.notice} role="note">
          <div className={s.noticeIcon} aria-hidden="true">
            <Info size={16} />
          </div>
          <div className={s.noticeText}>
            <p className={s.noticeTitle}>Campos requeridos</p>
            <p className={s.noticeBody}>
              Clave SP, Plaza, Puesto, Correo, Contraseña y Teléfono.
            </p>
          </div>
        </div>

        <div className={s.grid}>
          <label className={s.label} htmlFor={claveId}>
            Clave SP
            <div className={s.inputWrap}>
              <Hash className={s.inputIcon} size={16} aria-hidden="true" />
              <input
                id={claveId}
                className={s.input}
                value={value.claveSp}
                onChange={(e) => onChange('claveSp', e.target.value)}
                placeholder="210048332"
                inputMode="numeric"
                autoComplete="off"
              />
            </div>
          </label>

          <label className={s.label} htmlFor={plazaId}>
            Plaza
            <div className={s.inputWrap}>
              <BadgeCheck className={s.inputIcon} size={16} aria-hidden="true" />
              <input
                id={plazaId}
                className={s.input}
                value={value.plaza}
                onChange={(e) => onChange('plaza', e.target.value)}
                placeholder="2340000000002125"
                inputMode="numeric"
                autoComplete="off"
              />
            </div>
          </label>

          <label className={s.label} htmlFor={puestoId}>
            Puesto
            <div className={s.inputWrap}>
              <BriefcaseBusiness className={s.inputIcon} size={16} aria-hidden="true" />
              <input
                id={puestoId}
                className={s.input}
                value={value.puesto}
                onChange={(e) => onChange('puesto', e.target.value)}
                placeholder='ANALISTA ESPECIALIZADO "B"'
                autoComplete="organization-title"
              />
            </div>
          </label>

          <label className={s.label} htmlFor={emailId}>
            Correo
            <div className={s.inputWrap}>
              <Mail className={s.inputIcon} size={16} aria-hidden="true" />
              <input
                id={emailId}
                className={s.input}
                value={value.email}
                onChange={(e) => onChange('email', e.target.value)}
                placeholder="nombre.apellido@edomex.gob.mx"
                inputMode="email"
                autoComplete="email"
              />
            </div>
          </label>

          <label className={s.label} htmlFor={passId}>
            Contraseña
            <div className={s.inputWrap}>
              <KeyRound className={s.inputIcon} size={16} aria-hidden="true" />
              <input
                id={passId}
                className={s.input}
                type={passType}
                value={value.password}
                onChange={(e) => onChange('password', e.target.value)}
                placeholder="MiPassword#2026"
                autoComplete="new-password"
              />

              <button
                type="button"
                className={s.passToggle}
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                title={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPass ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
              </button>
            </div>
          </label>

          <label className={s.label} htmlFor={phoneId}>
            Teléfono
            <div className={s.inputWrap}>
              <Phone className={s.inputIcon} size={16} aria-hidden="true" />
              <input
                id={phoneId}
                className={s.input}
                value={value.phone}
                onChange={(e) => onChange('phone', e.target.value)}
                placeholder="7221234567"
                inputMode="tel"
                autoComplete="tel"
              />
            </div>
          </label>
        </div>

        {error ? (
          <div className={s.error} role="alert">
            <div className={s.errorTitle}>No se pudo completar el registro</div>
            <div className={s.errorMsg}>{error}</div>
          </div>
        ) : null}

        <button className={s.btn} onClick={onSubmit} disabled={loading}>
          <span>{loading ? 'Registrando…' : 'Crear cuenta'}</span>
          <ArrowRight size={16} aria-hidden="true" />
        </button>

        <div className={s.bottom}>
          <span className={s.bottomText}>¿Ya tienes cuenta?</span>
          <Link className={s.linkStrong} href={loginHref}>Volver a iniciar sesión</Link>
        </div>
      </div>
    </section>
  );
}