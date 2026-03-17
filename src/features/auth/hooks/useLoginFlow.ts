'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '../context/auth.context';
import type { UseLoginFlowResult } from '../types/loginFlow.types';
import { obtenerSesion } from '../services/auth-me.service';
import type { AuthModalSource } from '../ui/AuthModal/AuthModal';

function safeTrim(v: string) {
  return (v ?? '').trim();
}

type UseLoginFlowOptions = {
  source?: AuthModalSource;
  returnTo?: string | null;
  appCode?: string | null;
};

export function useLoginFlow(
  options?: UseLoginFlowOptions
): UseLoginFlowResult & { reset: () => void } {
  const router = useRouter();

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

  const source = options?.source ?? 'nav';
  const returnTo = options?.returnTo ?? null;
  const modalAppCode = options?.appCode ?? null;

  const effectiveAppCode = useMemo(
    () => modalAppCode ?? ctxAppCode ?? 'PLAT_SERV',
    [modalAppCode, ctxAppCode]
  );

  useEffect(() => {
    if (modalAppCode) {
      setAppCode(modalAppCode);
    }
  }, [modalAppCode, setAppCode]);

  const reset = useCallback(() => {
    setUsername('');
    setPassword('');
  }, []);

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

      const destPath = returnTo ?? resolveHome();
      const shouldFocusQuickAccess =
        source === 'nav' && !returnTo && destPath === '/';

      try {
        if (shouldFocusQuickAccess) {
          sessionStorage.setItem('portal_post_login_focus', 'quick-access');
          sessionStorage.setItem('portal_unlock_fx', '1');
        } else {
          sessionStorage.removeItem('portal_post_login_focus');
          sessionStorage.removeItem('portal_unlock_fx');
        }
      } catch {
        // noop
      }

      toast.success('Acceso autorizado.', { id: tId });

      if (typeof window !== 'undefined' && destPath === window.location.pathname) {
        if (shouldFocusQuickAccess) {
          window.dispatchEvent(new CustomEvent('portal:focus-quick-access'));
        }
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
      source,
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
    reset,
  };
}