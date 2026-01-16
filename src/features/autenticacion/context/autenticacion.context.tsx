'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { SesionMe } from '../types/autenticacion.types';
import type { LoginRequest } from '../types/autenticacion.types';
import { iniciarSesion } from '../services/inicio-sesion.service';
import { obtenerSesion } from '../services/sesion.service';
import { esApiError, toErrorMessage } from '@/lib/api/api.errores';

type AuthState = {
  sesion: SesionMe | null;
  appCode: string | null;

  loading: boolean;
  error: string | null;

  login: (args: LoginRequest) => Promise<boolean>;
  refresh: () => Promise<void>;
  logout: () => void;

  isAuthenticated: boolean;
};

const APP_CODE_KEY = 'portal_app_code';

const AuthContext = createContext<AuthState | null>(null);

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider />');
  return ctx;
}

function leerAppCode(): string | null {
  try {
    return localStorage.getItem(APP_CODE_KEY);
  } catch {
    return null;
  }
}

function guardarAppCode(v: string) {
  try {
    localStorage.setItem(APP_CODE_KEY, v);
  } catch {
    // noop
  }
}

function limpiarAppCode() {
  try {
    localStorage.removeItem(APP_CODE_KEY);
  } catch {
    // noop
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [sesion, setSesion] = useState<SesionMe | null>(null);
  const [appCode, setAppCode] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const me = await obtenerSesion();
      setSesion(me);
    } catch (e) {
      // Si 401/403: sesión no existe => normal
      if (esApiError(e) && (e.status === 401 || e.status === 403)) {
        setSesion(null);
        setError(null);
      } else {
        setSesion(null);
        setError(toErrorMessage(e));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (args: LoginRequest) => {
      setLoading(true);
      setError(null);

      try {
        const payload: LoginRequest = {
          username: args.username.trim(),
          password: args.password,
          appCode: args.appCode.trim(),
        };

        await iniciarSesion(payload);

        guardarAppCode(payload.appCode);
        setAppCode(payload.appCode);

        await refresh();
        return true;
      } catch (e) {
        setSesion(null);
        setError(toErrorMessage(e, 'No se pudo iniciar sesión'));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [refresh]
  );

  const logout = useCallback(() => {
    limpiarAppCode();
    setAppCode(null);
    setSesion(null);
    setError(null);
  }, []);

  useEffect(() => {
    const stored = leerAppCode();
    if (stored) setAppCode(stored);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const isAuthenticated = Boolean(sesion?.userId);

  const value = useMemo<AuthState>(
    () => ({
      sesion,
      appCode,
      loading,
      error,
      login,
      refresh,
      logout,
      isAuthenticated,
    }),
    [sesion, appCode, loading, error, login, refresh, logout, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
