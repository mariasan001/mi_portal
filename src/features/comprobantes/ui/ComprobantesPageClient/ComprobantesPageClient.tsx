'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useAuth } from '@/features/auth';
import SiteNav from '@/features/site/Components/Nav/SiteNav';

import type { ComprobanteAccessKey } from '../../types/comprobantes.types';

import ComprobantesAccessGrid from '../ComprobantesAccessGrid/ComprobantesAccessGrid';
import ComprobantesHero from '../ComprobantesHero/ComprobantesHero';

import s from './ComprobantesPageClient.module.css';

type HeroView = ComprobanteAccessKey | 'menu';
type TransitionPhase = 'idle' | 'collapsing' | 'expanded';

const COLLAPSE_DURATION_MS = 240;
const RETURN_DURATION_MS = 320;
/**
 * Construye el copy del hero según el estado actual del módulo.
 */
function buildHeroCopy(view: HeroView, displayName: string) {
  if (view === 'menu') {
    return {
      title: 'Hola,',
      accent: `Maria Guadalupe`,
      subtitleStrong: 'Nos da mucho gusto tenerte aquí.',
      subtitle:
        'Desde este portal podrás consultar tus comprobantes, constancias, movimientos de personal y demás servicios digitales disponibles para ti.',
    };
  }

  if (view === 'comprobante-quincenal') {
    return {
      title: 'Comprobante',
      accent: 'quincenal',
      subtitleStrong: 'Consulta tu documento de forma clara y rápida.',
      subtitle:
        'Completa el formulario correspondiente para consultar y descargar tu comprobante de percepciones y deducciones.',
    };
  }

  if (view === 'constancia-quincenal') {
    return {
      title: 'Constancia',
      accent: 'quincenal',
      subtitleStrong: 'Consulta tu constancia en formato digital.',
      subtitle:
        'Selecciona esta opción para acceder a tu constancia quincenal correspondiente.',
    };
  }

  if (view === 'constancia-anualizada') {
    return {
      title: 'Constancia',
      accent: 'anualizada',
      subtitleStrong: 'Consulta tu documento anualizado.',
      subtitle:
        'En este apartado podrás obtener la constancia anualizada con la información correspondiente.',
    };
  }

  return {
    title: 'Comprobantes',
    accent: 'CFDI',
    subtitleStrong: 'Consulta tus CFDI disponibles.',
    subtitle:
      'Aquí podrás consultar y descargar tus comprobantes fiscales digitales desde el sistema.',
  };
}

export default function ComprobantesPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { isAuthenticated, loading, sesion } = useAuth();

  const [selectedKey, setSelectedKey] = useState<ComprobanteAccessKey | null>(null);
  const [phase, setPhase] = useState<TransitionPhase>('idle');

  const selectTimerRef = useRef<number | null>(null);
  const backTimerRef = useRef<number | null>(null);

  const displayName = sesion?.username ?? 'Usuario';
  const heroView: HeroView = selectedKey ?? 'menu';

  const heroCopy = useMemo(
    () => buildHeroCopy(heroView, displayName),
    [heroView, displayName]
  );

  const clearTimers = useCallback(() => {
    if (selectTimerRef.current) {
      window.clearTimeout(selectTimerRef.current);
      selectTimerRef.current = null;
    }

    if (backTimerRef.current) {
      window.clearTimeout(backTimerRef.current);
      backTimerRef.current = null;
    }
  }, []);

  const handleSelectView = useCallback((key: ComprobanteAccessKey) => {
    if (phase !== 'idle') return;

    clearTimers();
    setSelectedKey(key);
    setPhase('collapsing');

    selectTimerRef.current = window.setTimeout(() => {
      setPhase('expanded');
      selectTimerRef.current = null;
    }, COLLAPSE_DURATION_MS);
  }, [clearTimers, phase]);

  const handleBack = useCallback(() => {
    if (!selectedKey) return;

    clearTimers();
    setPhase('collapsing');

    backTimerRef.current = window.setTimeout(() => {
      setSelectedKey(null);
      setPhase('idle');
      backTimerRef.current = null;
    }, RETURN_DURATION_MS);
  }, [clearTimers, selectedKey]);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      const query = searchParams.toString();
      const fullPath = query ? `${pathname}?${query}` : pathname;

      router.replace(`/login?redirect=${encodeURIComponent(fullPath)}`);
    }
  }, [isAuthenticated, loading, pathname, router, searchParams]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

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