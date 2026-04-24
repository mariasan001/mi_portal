'use client';

import { useMenuResource } from '../application/useMenuResource';
import { Sidebar } from './Sidebar';

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
  const { data, loading, error } = useMenuResource(appCode);
  const resolvedUserLabel = loading
    ? 'Cargando menu...'
    : error
      ? 'Menu no disponible'
      : userLabel;

  return (
    <Sidebar
      items={data?.items ?? []}
      defaultCollapsed={defaultCollapsed}
      userLabel={resolvedUserLabel}
      userName={userName}
      onLogout={onLogout}
      onCollapsedChange={onCollapsedChange}
    />
  );
}
