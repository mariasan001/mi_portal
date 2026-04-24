import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { buildAuthModalHref } from '@/features/auth/utils/authRedirect';
import { hasAdminAccess } from '@/lib/auth/server';

import AdminShell from './AdminShell';
import { APP_ROUTES } from '../_lib/routes';

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
    redirect(buildAuthModalHref({ returnTo: APP_ROUTES.admin.root }));
  }

  const canAccessAdmin = await hasAdminAccess(cookieHeader);

  if (!canAccessAdmin) {
    redirect(APP_ROUTES.home);
  }

  return <AdminShell appCode={null}>{children}</AdminShell>;
}
