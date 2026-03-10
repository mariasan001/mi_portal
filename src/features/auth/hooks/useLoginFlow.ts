'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
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
      console.log('🪪 [useLoginFlow] appCode desde query:', appCodeFromQuery);
      setAppCode(appCodeFromQuery);
    }
  }, [appCodeFromQuery, setAppCode]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const u = safeTrim(username);

    if (!u || !password) {
      toast.warning('Completa usuario y contraseña.');
      return;
    }

    if (loading) return;

    console.log('📨 [useLoginFlow] submit con:', {
      username: u,
      appCode: effectiveAppCode,
      returnTo,
    });

    const tId = toast.loading('Validando acceso…');

    const ok = await login({
      username: u,
      password,
      appCode: effectiveAppCode,
    });

    console.log('✅ [useLoginFlow] resultado login:', ok);

    if (!ok) {
      toast.error(
        error ?? 'No fue posible iniciar sesión. Verifica tus datos.',
        { id: tId }
      );
      return;
    }

    const me = await obtenerSesion();

    console.log('🔐 [useLoginFlow] sesión fresca:', me);

    const destPath = returnTo ?? resolveHome();

    console.log('🚦 [useLoginFlow] destino final:', destPath);

    toast.success('Acceso autorizado.', { id: tId });

    router.replace(destPath);
    router.refresh();
  }

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