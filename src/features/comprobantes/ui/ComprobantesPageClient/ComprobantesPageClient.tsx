'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useAuth } from '@/features/auth';
import SiteNav from '@/features/site/Components/Nav/SiteNav';

import type {
  ComprobanteAccessKey,
  ComprobantesView,
} from '../../types/comprobantes.types';

import ComprobantesAccessGrid from '../ComprobantesAccessGrid/ComprobantesAccessGrid';
import ComprobantesHero from '../ComprobantesHero/ComprobantesHero';
import ComprobantesWorkspace from '../ComprobantesWorkspace/ComprobantesWorkspace';

import s from './ComprobantesPageClient.module.css';

/**
 * Construye el copy del hero según el estado actual del módulo.
 */
function buildHeroCopy(view: ComprobantesView, displayName: string) {
  if (view === 'menu') {
    return {
      title: 'Hola,',
      accent: `${displayName}.`,
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
  const [view, setView] = useState<ComprobantesView>('menu');

  const displayName = sesion?.username ?? 'Usuario';

  const heroCopy = useMemo(
    () => buildHeroCopy(view, displayName),
    [view, displayName]
  );

  /**
   * Cambia la vista activa al módulo seleccionado.
   */
  const handleSelectView = useCallback((key: ComprobanteAccessKey) => {
    setView(key);
  }, []);

  /**
   * Regresa a la vista de menú principal.
   */
  const handleBack = useCallback(() => {
    setView('menu');
  }, []);

  /**
   * Si no existe sesión válida, redirige al login
   * preservando la ruta actual.
   */
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
            />

            {view === 'menu' ? (
              <ComprobantesAccessGrid onSelect={handleSelectView} />
            ) : (
              <ComprobantesWorkspace view={view} onBack={handleBack} />
            )}
          </div>
        </section>
      </main>
    </>
  );
}