'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { toast } from 'sonner';

import { useAuth } from '../context/auth.context';
import type { UseLoginFlowResult } from '../types/loginFlow.types';
import { getLoginFlowParams } from '../utils/authQuery';
import { obtenerSesion } from '../services/auth-me.service';

function safeTrim(v: string) {
  return (v ?? '').trim();
}

export function useLoginFlow(): UseLoginFlowResult {
  const router = useRouter();
  const sp = useSearchParams();

  const {
    login,
    loading,
    error,
    appCode: ctxAppCode,
    setAppCode,
    resolveHome,
  } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { appCodeFromQuery, returnTo } = useMemo(
    () => getLoginFlowParams(sp),
    [sp]
  );

  const effectiveAppCode = useMemo(
    () => appCodeFromQuery ?? ctxAppCode ?? 'PLAT_SERV',
    [appCodeFromQuery, ctxAppCode]
  );

  useEffect(() => {
    if (appCodeFromQuery) {
      setAppCode(appCodeFromQuery);
    }
  }, [appCodeFromQuery, setAppCode]);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const normalizedUsername = safeTrim(username);

      if (!normalizedUsername || !password) {
        toast.warning('Completa usuario y contraseña.');
        return;
      }

      if (loading) return;

      const tId = toast.loading('Validando acceso…');

      const ok = await login({
        username: normalizedUsername,
        password,
        appCode: effectiveAppCode,
      });

      if (!ok) {
        toast.error(
          error ?? 'No fue posible iniciar sesión. Verifica tus datos.',
          { id: tId }
        );
        return;
      }

      await obtenerSesion();

      try {
        sessionStorage.setItem('portal_post_login_focus', 'quick-access');
        sessionStorage.setItem('portal_unlock_fx', '1');
      } catch {
        // noop
      }

      const destPath = returnTo ?? resolveHome();

      toast.success('Acceso autorizado.', { id: tId });

      if (
        typeof window !== 'undefined' &&
        destPath === window.location.pathname
      ) {
        window.dispatchEvent(new CustomEvent('portal:focus-quick-access'));
        router.refresh();
        return;
      }

      router.replace(destPath);
      router.refresh();
    },
    [
      username,
      password,
      loading,
      login,
      effectiveAppCode,
      error,
      returnTo,
      resolveHome,
      router,
    ]
  );

  return {
    username,
    setUsername,
    password,
    setPassword,
    effectiveAppCode,
    returnTo,
    onSubmit,
    loading,
    error,
  };
}