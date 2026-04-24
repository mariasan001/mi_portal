// src/app/usuario/layout.tsx
import type { ReactNode } from 'react';

import UserRouteGuard from './UserRouteGuard';
import { APP_ACCESS } from '../_lib/access';
import { APP_ROUTES } from '../_lib/routes';

export default function UsuarioLayout({ children }: { children: ReactNode }) {
  return (
    <UserRouteGuard
      allowRole={APP_ACCESS.usuario.role}
      allowAppCode={APP_ACCESS.usuario.appCode}
      redirectTo={APP_ROUTES.admin.root}
    >
      {children}
    </UserRouteGuard>
  );
}
