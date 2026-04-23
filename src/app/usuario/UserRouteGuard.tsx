// src/app/usuario/UserRouteGuard.tsx
'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { useAuth } from '@/features/auth/context/auth.context';
import { buildAuthModalHref } from '@/features/auth/utils/authRedirect';

type Props = {
  children: ReactNode;

  /** appCode permitido para este flujo */
  allowAppCode?: string; // default: PLAT_SERV
  /** rol permitido (ej: ROLE_SP_USER) */
  allowRole?: string; // default: ROLE_SP_USER
  /** a dónde mandar si NO cumple estando autenticado */
  redirectTo?: string; // default: /admin (o /login si prefieres)
};

function safeTrim(v: string | null | undefined) {
  return (v ?? '').trim();
}

function hasRole(roles: string[] | undefined, role: string) {
  return Array.isArray(roles) && roles.includes(role);
}

export default function UserRouteGuard({
  children,
  allowAppCode = 'PLAT_SERV',
  allowRole = 'ROLE_SP_USER',
  redirectTo = '/admin',
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { status, sesion, appCode } = useAuth();

  const isAllowed = useMemo(() => {
    if (status !== 'authenticated') return false;
    if (!sesion?.userId) return false;

    const roles = sesion.roles ?? [];
    const okRole = hasRole(roles, allowRole);

    const code = safeTrim(appCode);
    const okApp = !allowAppCode ? true : code === allowAppCode;

    return okRole && okApp;
  }, [status, sesion, appCode, allowRole, allowAppCode]);

  useEffect(() => {
    // 1) booting: no hagas nada todavía
    if (status === 'booting') return;

    // 2) sin sesión => login (respetando "from" para regresar)
    if (status === 'anonymous') {
      router.replace(
        buildAuthModalHref({ returnTo: pathname || '/usuario', appCode: allowAppCode })
      );
      router.refresh();
      return;
    }

    // 3) con sesión pero no autorizado => afuera
    if (status === 'authenticated' && !isAllowed) {
      router.replace(redirectTo);
      router.refresh();
    }
  }, [status, isAllowed, redirectTo, router, pathname, allowAppCode]);

  // evita parpadeos
  if (status === 'booting') return null;
  if (status === 'anonymous') return null;
  if (status === 'authenticated' && !isAllowed) return null;

  return <>{children}</>;
}
