'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/features/autenticacion/context/autenticacion.context';
import s from './LoginPage.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error } = useAuth();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('12345678');
  const [appCode, setAppCode] = useState('PLAT_SERV');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await login({ username, password, appCode });
    if (ok) router.push('/admin');
  }

  return (
    <div className={s.wrap}>
      <form className={s.card} onSubmit={onSubmit}>
        <div className={s.head}>
          <div className={s.bar} />
          <div>
            <div className={s.title}>Portal de Servicios</div>
            <div className={s.sub}>Acceso seguro por credenciales</div>
          </div>
        </div>

        <label className={s.label}>
          Usuario
          <input
            name="username"
            className={s.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          />
        </label>

        <label className={s.label}>
          Código de Aplicación (appCode)
          <input
            name="appCode"
            className={s.input}
            value={appCode}
            onChange={(e) => setAppCode(e.target.value)}
          />
        </label>

        {error ? <div className={s.error}>{error}</div> : null}

        <button className={s.btn} disabled={loading}>
          {loading ? 'Entrando...' : 'Iniciar sesión'}
        </button>

        <div className={s.tip}>Tip: si esto falla, no eres tú… es el backend jugando a las escondidas 😄</div>
      </form>
    </div>
  );
}
