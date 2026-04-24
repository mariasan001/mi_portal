'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useAuth } from '@/features/auth/context/auth.context';
import { buildAuthModalHref } from '@/features/auth/utils/authRedirect';
import { APP_ROUTES } from '../_lib/routes';

type Props = {
  children: ReactNode;
  allowAppCode?: string;
  allowRole?: string;
  redirectTo?: string;
};

function safeTrim(value: string | null | undefined) {
  return (value ?? '').trim();
}

function hasRequiredRole(roles: string[] | undefined, role: string) {
  return Array.isArray(roles) && roles.includes(role);
}

export default function UserRouteGuard({
  children,
  allowAppCode = 'PLAT_SERV',
  allowRole = 'ROLE_SP_USER',
  redirectTo = APP_ROUTES.admin.root,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { status, sesion, appCode } = useAuth();

  const isAllowed = useMemo(() => {
    if (status !== 'authenticated') return false;
    if (!sesion?.userId) return false;

    const roles = sesion.roles ?? [];
    const roleAllowed = hasRequiredRole(roles, allowRole);
    const currentAppCode = safeTrim(appCode);
    const appAllowed = !allowAppCode ? true : currentAppCode === allowAppCode;

    return roleAllowed && appAllowed;
  }, [status, sesion, appCode, allowRole, allowAppCode]);

  useEffect(() => {
    if (status === 'booting') return;

    if (status === 'anonymous') {
      router.replace(
        buildAuthModalHref({
          returnTo: pathname || APP_ROUTES.usuario.root,
          appCode: allowAppCode,
        })
      );
      router.refresh();
      return;
    }

    if (status === 'authenticated' && !isAllowed) {
      router.replace(redirectTo);
      router.refresh();
    }
  }, [status, isAllowed, redirectTo, router, pathname, allowAppCode]);

  if (status === 'booting') return null;
  if (status === 'anonymous') return null;
  if (status === 'authenticated' && !isAllowed) return null;

  return <>{children}</>;
}
