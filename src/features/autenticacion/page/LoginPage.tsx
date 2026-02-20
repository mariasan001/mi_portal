'use client';

import { useLoginFlow } from '../hook/useLoginFlow';
import s from './LoginPage.module.css';

export default function LoginPage() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    effectiveAppCode,
    loading,
    error,
    onSubmit,
  } = useLoginFlow();

  return (
    <div className={s.wrap}>
      <form className={s.card} onSubmit={onSubmit}>
        <div className={s.head}>
          <div className={s.bar} />
          <div>
            <div className={s.title}>Portal de Servicios</div>
            <div className={s.sub}>
              Acceso seguro {effectiveAppCode ? `· ${effectiveAppCode}` : ''}
            </div>
          </div>
        </div>

        <label className={s.label}>
          Usuario
          <input
            name="username"
            className={s.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </label>

        <label className={s.label}>
          Contraseña
          <input
            name="password"
            type="password"
            className={s.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        <input type="hidden" name="appCode" value={effectiveAppCode} />

        {error ? <div className={s.error}>{error}</div> : null}

        <button className={s.btn} disabled={loading}>
          {loading ? 'Entrando...' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  );
}