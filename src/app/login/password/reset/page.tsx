'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useResetPassword } from '@/features/auth/hooks/useResetPassword';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const { loading, error, ok, submit } = useResetPassword();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await submit(email, otp, newPassword);
  }

  return (
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span style={{ fontSize: 12, opacity: 0.75 }}>Correo</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span style={{ fontSize: 12, opacity: 0.75 }}>OTP</span>
          <input value={otp} onChange={(e) => setOtp(e.target.value)} className="input" />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span style={{ fontSize: 12, opacity: 0.75 }}>Nueva contraseña</span>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input"
          />
        </label>

        {error ? <div style={{ fontSize: 13, color: 'var(--danger)' }}>{error}</div> : null}

        {ok ? (
          <div style={{ fontSize: 13, opacity: 0.8 }}>
            Contraseña actualizada. <Link href="/login">Ir a iniciar sesión</Link>.
          </div>
        ) : null}

        <button disabled={loading || !email.trim() || !otp.trim() || newPassword.length < 8} className="btn">
          {loading ? 'Guardando…' : 'Guardar nueva contraseña'}
        </button>
      </form>
  );
}