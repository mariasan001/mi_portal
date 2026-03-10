'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { SesionMe } from '../types/me.types';
import type { LoginRequest } from '../types/login.types';

import { iniciarSesion } from '../services/auth-login.service';
import { obtenerSesion } from '../services/auth-me.service';

import { esApiError, toErrorMessage } from '@/lib/api/api.errores';

type AuthMode = 'admin' | 'user';

type RouteDecision = {
  path: string;
  mode: AuthMode;
};

function hasRole(roles: readonly string[], role: string) {
  return roles.includes(role);
}

function resolvePostLoginRoute(
  appCode: string | null,
  roles: readonly string[]
): RouteDecision {
  const code = (appCode ?? '').trim();

  /**
   * Portal de Servicios
   * - admin -> /admin
   * - user  -> /
   */
  if (!code || code === 'PLAT_SERV') {
    if (hasRole(roles, 'ROLE_SP_ADMIN')) {
      return { path: '/admin', mode: 'admin' };
    }

    if (hasRole(roles, 'ROLE_SP_USER')) {
      return { path: '/', mode: 'user' };
    }

    return { path: '/', mode: 'user' };
  }

  /**
   * fallback general
   */
  return { path: '/', mode: 'user' };
}

type AuthStatus = 'booting' | 'authenticated' | 'anonymous';

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

type RoleLike =
  | string
  | {
      name?: string;
      authority?: string;
    };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [sesion, setSesion] = useState<SesionMe | null>(null);
  const [appCode, _setAppCode] = useState<string | null>(null);

  const [status, setStatus] = useState<AuthStatus>('booting');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setAppCode = useCallback((code: string | null) => {
    if (!code) {
      limpiarAppCode();
      _setAppCode(null);
      return;
    }

    const clean = code.trim();
    guardarAppCode(clean);
    _setAppCode(clean);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const me = await obtenerSesion();

      console.log('🔐 [AuthProvider.refresh] sesión obtenida:', me);

      setSesion(me);
      setStatus('authenticated');
    } catch (e) {
      if (esApiError(e) && (e.status === 401 || e.status === 403)) {
        console.log('🟡 [AuthProvider.refresh] sin sesión activa (401/403)');
        setSesion(null);
        setError(null);
        setStatus('anonymous');
      } else {
        console.log('🔴 [AuthProvider.refresh] error al obtener sesión:', e);
        setSesion(null);
        setError(toErrorMessage(e));
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
          username: args.username.trim(),
          password: args.password,
          appCode: args.appCode.trim(),
        };

        console.log('📨 [AuthProvider.login] payload:', payload);

        await iniciarSesion(payload);

        console.log('✅ [AuthProvider.login] login exitoso');

        setAppCode(payload.appCode);

        await refresh();

        return true;
      } catch (e) {
        console.log('🔴 [AuthProvider.login] error login:', e);
        setSesion(null);
        setStatus('anonymous');
        setError(toErrorMessage(e, 'No se pudo iniciar sesión'));

        return false;
      } finally {
        setLoading(false);
      }
    },
    [refresh, setAppCode]
  );

  const logout = useCallback(() => {
    console.log('🚪 [AuthProvider.logout] cerrando sesión');

    limpiarAppCode();
    _setAppCode(null);
    setSesion(null);
    setError(null);
    setStatus('anonymous');
  }, []);

  useEffect(() => {
    const stored = leerAppCode();
    if (stored) {
      console.log('💾 [AuthProvider] appCode recuperado de storage:', stored);
      _setAppCode(stored);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const isAuthenticated = Boolean(sesion?.userId);

  const roles = useMemo<readonly string[]>(() => {
    const raw = sesion?.roles as RoleLike[] | undefined;

    if (!Array.isArray(raw)) return [];

    return raw
      .map((role) => {
        if (typeof role === 'string') return role;
        return role.name ?? role.authority ?? '';
      })
      .filter((r): r is string => Boolean(r));
  }, [sesion]);

  const roleCheck = useCallback((role: string) => hasRole(roles, role), [roles]);

  const decision = useMemo(
    () => resolvePostLoginRoute(appCode, roles),
    [appCode, roles]
  );

  const resolveHome = useCallback(
    () => resolvePostLoginRoute(appCode, roles).path,
    [appCode, roles]
  );

  useEffect(() => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔐 [AuthProvider] sesion completa:', sesion);
    console.log('🪪 [AuthProvider] appCode actual:', appCode);
    console.log('🧩 [AuthProvider] roles normalizados:', roles);
    console.log('🧭 [AuthProvider] decision de ruta:', decision);
    console.log('🏠 [AuthProvider] resolveHome():', resolveHome());
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }, [sesion, appCode, roles, decision, resolveHome]);

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