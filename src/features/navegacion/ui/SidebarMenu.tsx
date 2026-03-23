'use client';

import { Sidebar } from './Sidebar';
import { useMenu } from '../hooks/useMenu';

type SidebarMenuProps = {
  appCode: string | null;
  defaultCollapsed?: boolean;
  userLabel?: string;
  userName?: string | null;
  onLogout?: () => void;
  onCollapsedChange?: (collapsed: boolean) => void;
};

export function SidebarMenu({
  appCode,
  defaultCollapsed = false,
  userLabel = 'Usuario',
  userName,
  onLogout,
  onCollapsedChange,
}: SidebarMenuProps) {
  const { data, loading, error } = useMenu(appCode);

  return (
    <Sidebar
      items={data?.items ?? []}
      defaultCollapsed={defaultCollapsed}
      userLabel={loading ? 'Cargando menú...' : error ? 'Menú no disponible' : userLabel}
      userName={userName}
      onLogout={onLogout}
      onCollapsedChange={onCollapsedChange}
    />
  );
}