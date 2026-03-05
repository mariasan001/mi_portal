'use client';

import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';

import { Sidebar } from '@/features/navegacion/ui/Sidebar';
import { useMenu } from '@/features/navegacion/hooks/useMenu';
import { useAuth } from '@/features/auth/context/auth.context';

import s from './AdminShell.module.css';

type Props = {
  children: ReactNode;
  appCode: string | null;
};

export default function AdminShell({ children, appCode }: Props) {
  const menu = useMenu(appCode);
  const sidebarItems = useMemo(() => menu.data?.items ?? [], [menu.data]);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const { logout } = useAuth();

  return (
    <div className={`${s.layout} ${isCollapsed ? s.isCollapsed : ''}`}>
      <Sidebar
        items={sidebarItems}
        userLabel="Usuario"
        userName={null}
        onLogout={logout}
        onCollapsedChange={setIsCollapsed}
      />

      <main className={s.main}>{children}</main>
    </div>
  );
}