// src/features/site/Components/AppDownloadSection/AppDownloadSection.tsx
'use client';

import s from './AppDownloadSection.module.css';
import { FiSmartphone, FiCheck, FiArrowUpRight } from 'react-icons/fi';
import { useRevealMotion } from '@/hooks/useRevealMotion';
import { isExternalHref } from '../DudasSection/utils/dudas.utils';
import { APP_DOWNLOAD_BENEFITS } from './constants/constants';


export type AppDownloadSectionProps = {
  title?: string;
  subtitle?: string;
  androidHref?: string;
  iosHref?: string;

  // ✅ imagen real (screenshot/mock)
  phoneImg?: string;
  phoneAlt?: string;
};

export default function AppDownloadSection({
  title = 'Lleva el portal en tu bolsillo',
  subtitle = 'Consulta tu descuento, revisa recibos de nómina y da seguimiento a trámites desde la aplicación.',
  androidHref = '#',
  iosHref = '#',
  phoneImg = '/img/app_movil.png',
  phoneAlt = 'Vista previa de la aplicación móvil',
}: AppDownloadSectionProps) {
  const { ref: sectionRef, className } = useRevealMotion<HTMLElement>({
    threshold: 0.25,
    thresholdPx: 2,
  });

  const androidExternal = isExternalHref(androidHref);
  const iosExternal = isExternalHref(iosHref);

  return (
    <section
      ref={sectionRef}
      className={className(s.wrap, s.isIn, s.dirDown, s.dirUp)}
      aria-label="Descargar aplicación móvil"
    >
      <div className={s.inner}>
        <div className={s.left}>
          <div className={s.kicker}>
            <span className={s.kickerIcon} aria-hidden="true">
              <FiSmartphone />
            </span>
            Aplicación móvil
          </div>

          <h2 className={s.title}>{title}</h2>
          <p className={s.subtitle}>{subtitle}</p>

          <ul className={s.list} aria-label="Beneficios">
            {APP_DOWNLOAD_BENEFITS.map((node, idx) => (
              <li key={idx} className={s.item}>
                <span className={s.itemIcon} aria-hidden="true">
                  <FiCheck />
                </span>
                <span className={s.itemText}>{node}</span>
              </li>
            ))}
          </ul>

          <div className={s.ctas} aria-label="Tiendas de descarga">
            <a
              className={s.btnPrimary}
              href={androidHref}
              aria-label="Abrir Google Play"
              target={androidExternal ? '_blank' : undefined}
              rel={androidExternal ? 'noreferrer' : undefined}
            >
              <span className={s.btnTop}>Disponible en</span>
              <span className={s.btnMain}>Google Play</span>
              <span className={s.btnIcon} aria-hidden="true">
                <FiArrowUpRight />
              </span>
            </a>

            <a
              className={s.btn}
              href={iosHref}
              aria-label="Abrir App Store"
              target={iosExternal ? '_blank' : undefined}
              rel={iosExternal ? 'noreferrer' : undefined}
            >
              <span className={s.btnTop}>Disponible en</span>
              <span className={s.btnMain}>App Store</span>
              <span className={s.btnIcon} aria-hidden="true">
                <FiArrowUpRight />
              </span>
            </a>
          </div>

          <p className={s.note} aria-hidden="true">
            Tip: inicia sesión con tu cuenta y verás tu información sincronizada.
          </p>
        </div>

        <div className={s.right}>
          <div className={s.mediaCard}>
            <img
              className={s.phoneImg}
              src={phoneImg}
              alt={phoneAlt}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
}