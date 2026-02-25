'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '../context/auth.context';
import type { UseLoginFlowResult } from '../types/loginFlow.types';
import { getLoginFlowParams } from '../utils/authQuery';

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
    const ok = await login({ username, password, appCode: effectiveAppCode });
    if (ok) router.push(returnTo);
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