'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '../context/auth.context';
import { obtenerSesion } from '../api/session.queries';
import type { UseLoginFlowResult } from '../model/login-flow.types';
import { safeTrim } from '../utils/authInput';
import { resolveAuthDestination } from '../utils/resolveAuthDestination';
import type { AuthModalSource } from '../ui/AuthModal/AuthModal';

type UseLoginFlowOptions = {
  source?: AuthModalSource;
  returnTo?: string | null;
  appCode?: string | null;
};

export function useLoginFlow(
  options?: UseLoginFlowOptions
): UseLoginFlowResult & { reset: () => void } {
  const router = useRouter();
  const { login, loading, error, appCode: ctxAppCode, setAppCode } = useAuth();

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
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const normalizedUsername = safeTrim(username);

      if (!normalizedUsername || !password) {
        toast.warning('Completa usuario y contrasena.');
        return;
      }

      if (loading) return;

      const toastId = toast.loading('Validando acceso...');

      try {
        const ok = await login({
          username: normalizedUsername,
          password,
          appCode: effectiveAppCode,
        });

        if (!ok) {
          toast.error(
            error ?? 'No fue posible iniciar sesion. Verifica tus datos.',
            { id: toastId }
          );
          return;
        }

        const sesion = await obtenerSesion();
        const { path: destinationPath, home } = resolveAuthDestination({
          sesion,
          appCode: effectiveAppCode,
          returnTo,
        });

        const shouldFocusQuickAccess =
          source === 'nav' &&
          !returnTo &&
          home === '/' &&
          destinationPath === '/';

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

        toast.success('Acceso autorizado.', { id: toastId });

        if (
          typeof window !== 'undefined' &&
          destinationPath === window.location.pathname
        ) {
          if (shouldFocusQuickAccess) {
            window.dispatchEvent(new CustomEvent('portal:focus-quick-access'));
          }

          router.refresh();
          return;
        }

        router.replace(destinationPath);
        router.refresh();
      } catch (submitError) {
        console.error('Error en login flow:', submitError);
        toast.error(
          error ?? 'No fue posible iniciar sesion. Verifica tus datos.',
          { id: toastId }
        );
      }
    },
    [
      username,
      password,
      loading,
      login,
      effectiveAppCode,
      error,
      returnTo,
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
