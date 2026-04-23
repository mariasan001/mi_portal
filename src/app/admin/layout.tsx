import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminShell from './AdminShell';
import { hasAdminAccess } from '@/lib/auth/server';
import { buildAuthModalHref } from '@/features/auth/utils/authRedirect';

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');

  if (!cookieHeader) {
    redirect(buildAuthModalHref({ returnTo: '/admin' }));
  }

  const canAccessAdmin = await hasAdminAccess(cookieHeader);

  if (!canAccessAdmin) {
    redirect('/');
  }

  return <AdminShell appCode={null}>{children}</AdminShell>;
}
