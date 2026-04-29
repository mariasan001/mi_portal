'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';

import { AdminBackgroundTaskProvider } from '@/features/admin/shared/context/admin-background-task.context';
import AdminFloatingBubble from '@/features/admin/shared/ui/AdminFloatingBubble/AdminFloatingBubble';
import { useAuth } from '@/features/auth/context/auth.context';
import { SidebarMenu } from '@/features/navegacion/ui/SidebarMenu';

import s from './AdminShell.module.css';

type Props = {
  children: ReactNode;
  appCode: string | null;
};

export default function AdminShell({ children, appCode }: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { logout, appCode: authAppCode, sesion } = useAuth();
  const resolvedAppCode = authAppCode ?? appCode;
  const userName = sesion?.username?.trim() || null;

  return (
    <AdminBackgroundTaskProvider>
      <div className={`${s.layout} ${isCollapsed ? s.isCollapsed : ''}`}>
        <SidebarMenu
          appCode={resolvedAppCode}
          userLabel="Usuario"
          userName={userName}
          onLogout={logout}
          onCollapsedChange={setIsCollapsed}
        />

        <main className={s.main}>{children}</main>
        <AdminFloatingBubble />
      </div>
    </AdminBackgroundTaskProvider>
  );
}
