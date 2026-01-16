'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/features/autenticacion/context/autenticacion.context';
import { useMenu } from '@/features/navegacion/hooks/useMenu';
import { Sidebar } from '@/features/navegacion/ui/Sidebar';

import s from './AdminShell.module.css';

export default function AdminShell() {
  const router = useRouter();
  const { sesion, appCode, loading: authLoading, isAuthenticated } = useAuth();
  const { data: menu, loading: menuLoading, error: menuError } = useMenu(appCode);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  if (!isAuthenticated) {
    return <div className={s.center}>Validando sesión...</div>;
  }

  return (
    <div className={s.layout}>
      <Sidebar title={menu?.appCode ?? 'Admin'} items={menu?.items ?? []} />

      <main className={s.main}>
        <div className={s.top}>
          <div className={s.h1}>Hola, {sesion?.username}</div>
          <div className={s.mini}>Estado: {sesion?.status}</div>
        </div>

        <div className={s.card}>
          {menuLoading ? (
            <div>Cargando menú...</div>
          ) : menuError ? (
            <div className={s.err}>Error menú: {menuError}</div>
          ) : (
            <div>
              <div className={s.ok}>Menú cargado ✅</div>
              <div className={s.note}>Ahora cada ruta del menú puede ser una pantalla real.</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
