'use client';

import Image from 'next/image';
import { FiArrowUpRight, FiCheck, FiSmartphone } from 'react-icons/fi';

import { useRevealMotion } from '@/hooks/useRevealMotion';

import s from './AppDownloadSection.module.css';
import { APP_DOWNLOAD_BENEFITS } from './model/app-download.benefits';
import { isExternalHref } from './model/isExternalHref';

export type AppDownloadSectionProps = {
  title?: string;
  subtitle?: string;
  androidHref?: string;
  iosHref?: string;
  phoneImg?: string;
  phoneAlt?: string;
};

export default function AppDownloadSection({
  title = 'Lleva el portal en tu bolsillo',
  subtitle = 'Consulta tu descuento, revisa recibos de nomina y da seguimiento a tramites desde la aplicacion.',
  androidHref = '#',
  iosHref = '#',
  phoneImg = '/img/app_movil.png',
  phoneAlt = 'Vista previa de la aplicacion movil',
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
      aria-label="Descargar aplicacion movil"
    >
      <div className={s.inner}>
        <div className={s.left}>
          <div className={s.kicker}>
            <span className={s.kickerIcon} aria-hidden="true">
              <FiSmartphone />
            </span>
            Aplicacion movil
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
            Tip: inicia sesion con tu cuenta y veras tu informacion sincronizada.
          </p>
        </div>

        <div className={s.right}>
          <div className={s.mediaCard}>
            <Image
              className={s.phoneImg}
              src={phoneImg}
              alt={phoneAlt}
              width={420}
              height={860}
              loading="lazy"
              sizes="(max-width: 980px) min(560px, 100vw), 420px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
