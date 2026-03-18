'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useAuth } from '@/features/auth';
import SiteNav from '@/features/site/Components/Nav/SiteNav';

import ComprobantesAccessGrid from '../ComprobantesAccessGrid/ComprobantesAccessGrid';

import s from './ComprobantesPageClient.module.css';
import ComprobantesHero from '../ComprobantesHero/ComprobantesHero';

export default function ComprobantesPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { isAuthenticated, loading, sesion } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      const query = searchParams.toString();
      const fullPath = query ? `${pathname}?${query}` : pathname;

      router.replace(`/login?redirect=${encodeURIComponent(fullPath)}`);
    }
  }, [isAuthenticated, loading, pathname, router, searchParams]);

  if (loading) {
    return (
      <main className={s.page}>
        <div className={s.centerBox}>Validando sesión...</div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const displayName = sesion?.username ?? 'Usuario';

  return (
    <>
      <SiteNav />

      <main className={s.page}>
        <section className={s.wrap}>
          <div className={s.inner}>
            <ComprobantesHero displayName={displayName} />
            <ComprobantesAccessGrid />
          </div>
        </section>
      </main>
    </>
  );
}