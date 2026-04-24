import { cache } from 'react';
import { obtenerIamBaseUrl } from '@/lib/config/entorno';
import type { SesionMe } from '@/features/auth/model/session.types';
import { isAdminRole, normalizeRoles } from './roles';

async function fetchSessionByCookieHeader(cookieHeader: string): Promise<SesionMe | null> {
  if (!cookieHeader.trim()) {
    return null;
  }

  const response = await fetch(`${obtenerIamBaseUrl()}/auth/me`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      cookie: cookieHeader,
    },
    cache: 'no-store',
  });

  if (response.status === 401 || response.status === 403) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`No se pudo consultar la sesion actual (${response.status})`);
  }

  return (await response.json()) as SesionMe;
}

export const getServerSessionByCookieHeader = cache(fetchSessionByCookieHeader);

export async function hasAdminAccess(cookieHeader: string): Promise<boolean> {
  const session = await getServerSessionByCookieHeader(cookieHeader);
  if (!session?.userId) {
    return false;
  }

  return isAdminRole(normalizeRoles(session.roles));
}
