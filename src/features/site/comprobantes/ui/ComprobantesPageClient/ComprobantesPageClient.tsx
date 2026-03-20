'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useAuth } from '@/features/auth';
import SiteNav from '@/features/site/Components/Nav/SiteNav';

import ComprobantesAccessGrid from '../ComprobantesAccessGrid/ComprobantesAccessGrid';
import ComprobantesHero from '../ComprobantesHero/ComprobantesHero';

import s from './ComprobantesPageClient.module.css';
import { useComprobantesAccessState } from '../../hook/useComprobantesAccessState';
import { buildHeroCopy } from '../../helper/comprobantesHeroCopy';

export default function ComprobantesPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { isAuthenticated, loading, sesion } = useAuth();

  const {
    selectedKey,
    phase,
    heroView,
    handleSelectView,
    handleBack,
  } = useComprobantesAccessState();

  const displayName = sesion?.username ?? 'Usuario';

  const heroCopy = useMemo(
    () => buildHeroCopy(heroView, displayName),
    [heroView, displayName]
  );

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

  return (
    <>
      <SiteNav />

      <main className={s.page}>
        <section className={s.wrap}>
          <div className={s.inner}>
            <ComprobantesHero
              title={heroCopy.title}
              accent={heroCopy.accent}
              subtitleStrong={heroCopy.subtitleStrong}
              subtitle={heroCopy.subtitle}
              contentKey={heroView}
            />

            <ComprobantesAccessGrid
              selectedKey={selectedKey}
              phase={phase}
              onSelect={handleSelectView}
              onBack={handleBack}
            />
          </div>
        </section>
      </main>
    </>
  );
}