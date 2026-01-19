import type { ReactNode } from 'react';
import AdminShell from './AdminShell';

export default function AdminLayout({ children }: { children: ReactNode }) {
  // ✅ Por ahora fijo para pruebas. Luego lo conectas a tu AuthContext / sesión.
  const appCode = 'PLAT_SERV';

  return <AdminShell appCode={appCode}>{children}</AdminShell>;
}
