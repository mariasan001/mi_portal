'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';

import { Sidebar } from '@/features/navegacion/ui/Sidebar';
import { useMenu } from '@/features/navegacion/hooks/useMenu';

function safeText(v: string | null | undefined, fallback: string) {
  const s = (v ?? '').trim();
  return s ? s : fallback;
}

export default function AdminShell({
  children,
  appCode,
}: {
  children: ReactNode;
  appCode: string | null;
}) {
  const menu = useMenu(appCode);

  // ✅ Ya NO asumimos root wrapper.
  // data.items ya debe ser la lista final (children a pintar).
  const sidebarItems = menu.data?.items ?? [];

  // ✅ Título: usa appCode (o un fallback bonito)
  const sidebarTitle = safeText(menu.data?.appCode, 'Menú');

  // ✅ Debug súper detallado (quítalo cuando ya esté ok)
  useEffect(() => {
    console.log('[AdminShell] appCode prop:', appCode);
    console.log('[AdminShell] loading:', menu.loading);
    console.log('[AdminShell] error:', menu.error);
    console.log('[AdminShell] data:', menu.data);

    console.table(
      sidebarItems.map((it) => ({
        code: it.code,
        name: it.name,
        route: it.route,
        icon: it.icon,
        children: it.children?.length ?? 0,
      }))
    );
  }, [appCode, menu.loading, menu.error, menu.data, sidebarItems]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar title={sidebarTitle} items={sidebarItems} />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
