'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { esApiError, toErrorMessage } from '@/lib/api/api.errores';

import { iniciarSesion } from '../api/login.commands';
import { obtenerSesion } from '../api/session.queries';
import { DEFAULT_AUTH_APP_CODE } from '../model/auth.constants';
import {
  getSessionRoles,
  hasRole as hasRoleFromList,
  resolveAuthHome,
} from '../model/auth.selectors';
import type { AuthStatus, AuthMode } from '../model/auth.types';
import type { LoginRequest } from '../model/login.types';
import type { SesionMe } from '../model/session.types';
import { safeTrim } from '../utils/authInput';
import {
  clearAuthAppCode,
  readAuthAppCode,
  writeAuthAppCode,
} from '../utils/authStorage';

type AuthState = {
  sesion: SesionMe | null;
  appCode: string | null;
  status: AuthStatus;
  loading: boolean;
  error: string | null;
  login: (args: LoginRequest) => Promise<boolean>;
  refresh: () => Promise<void>;
  logout: () => void;
  setAppCode: (code: string | null) => void;
  isAuthenticated: boolean;
  roles: readonly string[];
  hasRole: (role: string) => boolean;
  mode: AuthMode | null;
  homePath: string;
  resolveHome: () => string;
};

const AuthContext = createContext<AuthState | null>(null);

function resolvePostLoginRoute(appCode: string | null, roles: readonly string[]) {
  const code = safeTrim(appCode) || DEFAULT_AUTH_APP_CODE;
  const { home, mode } = resolveAuthHome(code, roles);

  return {
    path: home,
    mode,
  };
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider />');
  }

  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [sesion, setSesion] = useState<SesionMe | null>(null);
  const [appCode, setStoredAppCode] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>('booting');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setAppCode = useCallback((code: string | null) => {
    const clean = safeTrim(code);

    if (!clean) {
      clearAuthAppCode();
      setStoredAppCode(null);
      return;
    }

    writeAuthAppCode(clean);
    setStoredAppCode(clean);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const me = await obtenerSesion();
      setSesion(me);
      setStatus('authenticated');
    } catch (requestError) {
      if (
        esApiError(requestError) &&
        (requestError.status === 401 || requestError.status === 403)
      ) {
        setSesion(null);
        setError(null);
        setStatus('anonymous');
      } else {
        setSesion(null);
        setError(toErrorMessage(requestError));
        setStatus('anonymous');
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
          username: safeTrim(args.username),
          password: args.password,
          appCode: safeTrim(args.appCode),
        };

        await iniciarSesion(payload);
        setAppCode(payload.appCode);
        await refresh();

        return true;
      } catch (requestError) {
        setSesion(null);
        setStatus('anonymous');
        setError(toErrorMessage(requestError, 'No se pudo iniciar sesion'));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [refresh, setAppCode]
  );

  const logout = useCallback(() => {
    clearAuthAppCode();
    setStoredAppCode(null);
    setSesion(null);
    setError(null);
    setStatus('anonymous');
  }, []);

  useEffect(() => {
    const stored = readAuthAppCode();
    if (stored) {
      setStoredAppCode(stored);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const isAuthenticated = Boolean(sesion?.userId);
  const roles = useMemo<readonly string[]>(() => getSessionRoles(sesion), [sesion]);
  const roleCheck = useCallback(
    (role: string) => hasRoleFromList(roles, role),
    [roles]
  );
  const decision = useMemo(
    () => resolvePostLoginRoute(appCode, roles),
    [appCode, roles]
  );
  const resolveHome = useCallback(
    () => resolvePostLoginRoute(appCode, roles).path,
    [appCode, roles]
  );

  const value = useMemo<AuthState>(
    () => ({
      sesion,
      appCode,
      status,
      loading,
      error,
      login,
      refresh,
      logout,
      setAppCode,
      isAuthenticated,
      roles,
      hasRole: roleCheck,
      mode: isAuthenticated ? decision.mode : null,
      homePath: decision.path,
      resolveHome,
    }),
    [
      sesion,
      appCode,
      status,
      loading,
      error,
      login,
      refresh,
      logout,
      setAppCode,
      isAuthenticated,
      roles,
      roleCheck,
      decision.mode,
      decision.path,
      resolveHome,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
