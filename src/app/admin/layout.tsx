'use client';

import type { ReactNode } from 'react';
import { useAuth } from '@/features/auth/context/auth.context';
import AdminShell from './AdminShell';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { status, appCode } = useAuth();

  if (status === 'booting') {
    return <main style={{ padding: 24 }}>Cargando sesión…</main>;
  }

  if (status === 'anonymous') {
    return <main style={{ padding: 24 }}>Sin sesión. Ve a login.</main>;
  }

  // authenticated
  return <AdminShell appCode={appCode}>{children}</AdminShell>;
}