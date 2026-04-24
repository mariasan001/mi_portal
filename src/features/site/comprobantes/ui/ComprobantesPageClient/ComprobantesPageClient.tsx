'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useAuth } from '@/features/auth';
import { buildAuthModalHref } from '@/features/auth/utils/authRedirect';
import { SiteNav } from '@/features/site';

import { useComprobantesAccessController } from '../../application/useComprobantesAccessController';
import { buildHeroCopy } from '../../model/comprobantes.selectors';
import ComprobantesAccessGrid from '../ComprobantesAccessGrid/ComprobantesAccessGrid';
import ComprobantesHero from '../ComprobantesHero/ComprobantesHero';
import s from './ComprobantesPageClient.module.css';

export default function ComprobantesPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { isAuthenticated, loading } = useAuth();
  const {
    selectedKey,
    phase,
    heroView,
    handleSelectView,
    handleBack,
  } = useComprobantesAccessController();

  const heroCopy = useMemo(() => buildHeroCopy(heroView), [heroView]);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      const query = searchParams.toString();
      const fullPath = query ? `${pathname}?${query}` : pathname;

      router.replace(
        buildAuthModalHref({ returnTo: fullPath, appCode: 'PLAT_SERV' })
      );
    }
  }, [isAuthenticated, loading, pathname, router, searchParams]);

  if (loading) {
    return (
      <main className={s.page}>
        <div className={s.centerBox}>Validando sesion...</div>
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
