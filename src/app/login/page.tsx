'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/features/autenticacion/context/autenticacion.context';
import s from './LoginPage.module.css';

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const { login, loading, error, appCode: ctxAppCode, setAppCode } = useAuth();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('12345678');

  const appCodeFromQuery = sp.get('appCode')?.trim() || null;
  const returnTo = sp.get('returnTo') || '/admin';

  const effectiveAppCode = useMemo(
    () => appCodeFromQuery ?? ctxAppCode ?? 'PLAT_SERV',
    [appCodeFromQuery, ctxAppCode]
  );

  useEffect(() => {
    if (appCodeFromQuery) setAppCode(appCodeFromQuery);
  }, [appCodeFromQuery, setAppCode]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await login({ username, password, appCode: effectiveAppCode });
    if (ok) router.push(returnTo);
  }

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

        {/* ✅ ya no se edita: el appCode lo decide el módulo */}
        <input type="hidden" name="appCode" value={effectiveAppCode} />

        {error ? <div className={s.error}>{error}</div> : null}

        <button className={s.btn} disabled={loading}>
          {loading ? 'Entrando...' : 'Iniciar sesión'}
        </button>

        <div className={s.tip}>
          Tip: aquí el que manda es el módulo… tú solo autorizas 😄
        </div>
      </form>
    </div>
  );
}