'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '../context/auth.context';
import type { UseLoginFlowResult } from '../types/loginFlow.types';
import { getLoginFlowParams } from '../utils/authQuery';

function safeTrim(v: string) {
  return (v ?? '').trim();
}

export function useLoginFlow(): UseLoginFlowResult {
  const router = useRouter();
  const sp = useSearchParams();

  const { login, loading, error, appCode: ctxAppCode, setAppCode } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { appCodeFromQuery, returnTo } = useMemo(() => getLoginFlowParams(sp), [sp]);

  const effectiveAppCode = useMemo(
    () => appCodeFromQuery ?? ctxAppCode ?? 'PLAT_SERV',
    [appCodeFromQuery, ctxAppCode]
  );

  useEffect(() => {
    if (appCodeFromQuery) setAppCode(appCodeFromQuery);
  }, [appCodeFromQuery, setAppCode]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const u = safeTrim(username);
    if (!u || !password) {
      toast.warning('Completa usuario y contraseña.');
      return;
    }

    // 🧠 Evita duplicados si el usuario spamea el botón
    if (loading) return;

    const tId = toast.loading('Validando acceso…');

    const ok = await login({ username: u, password, appCode: effectiveAppCode });

    if (ok) {
      toast.success('Acceso autorizado.', { id: tId });
      router.push(returnTo);
      return;
    }

    // Si el context ya trae un error, úsalo. Si no, uno genérico.
    toast.error(error ?? 'No fue posible iniciar sesión. Verifica tus datos.', { id: tId });
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