// src/app/usuario/layout.tsx
import type { ReactNode } from 'react';

import UserShell from './UserShell';
import UserRouteGuard from './UserRouteGuard';

export default function UsuarioLayout({ children }: { children: ReactNode }) {
  return (
    <UserRouteGuard allowRole="ROLE_SP_USER" allowAppCode="PLAT_SERV" redirectTo="/admin">
      <UserShell title="Panel de usuario">
        {children}
      </UserShell>
    </UserRouteGuard>
  );
}