'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useVerifyOtp } from '@/features/auth/hooks/useVerifyOtp';

export default function VerifyOtpPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [otp, setOtp] = useState('');

  const { loading, error, ok, submit } = useVerifyOtp();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await submit(usernameOrEmail, otp, 'PASSWORD_RESET');
  }

  return (
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span style={{ fontSize: 12, opacity: 0.75 }}>Usuario o correo</span>
          <input
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            placeholder="usuario o correo"
            className="input"
          />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span style={{ fontSize: 12, opacity: 0.75 }}>OTP</span>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            className="input"
          />
        </label>

        {error ? <div style={{ fontSize: 13, color: 'var(--danger)' }}>{error}</div> : null}

        {ok ? (
          <div style={{ fontSize: 13, opacity: 0.8 }}>
            OTP válido. Ahora ve a <Link href="login/password/reset">restablecer contraseña</Link>.
          </div>
        ) : null}

        <button disabled={loading || !usernameOrEmail.trim() || !otp.trim()} className="btn">
          {loading ? 'Validando…' : 'Validar OTP'}
        </button>

        <div style={{ marginTop: 8, fontSize: 13, opacity: 0.75 }}>
          <Link href="login/password/forgot">Reenviar OTP</Link>
        </div>
      </form>
  );
}