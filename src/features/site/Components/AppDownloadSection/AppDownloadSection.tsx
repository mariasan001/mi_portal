// src/features/site/Components/AppDownloadSection/AppDownloadSection.tsx
'use client';

import s from './AppDownloadSection.module.css';
import { FiSmartphone, FiCheck, FiArrowUpRight } from 'react-icons/fi';

type Props = {
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
}: Props) {
  return (
    <section className={s.wrap} aria-label="Descargar aplicación móvil">
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
            <li className={s.item}>
              <span className={s.itemIcon} aria-hidden="true"><FiCheck /></span>
              <span className={s.itemText}>
                Consulta tu <strong>límite</strong> y movimientos de <strong>descuento</strong>.
              </span>
            </li>

            <li className={s.item}>
              <span className={s.itemIcon} aria-hidden="true"><FiCheck /></span>
              <span className={s.itemText}>
                Accede a <strong>recibos de nómina</strong> y documentos desde el celular.
              </span>
            </li>

            <li className={s.item}>
              <span className={s.itemIcon} aria-hidden="true"><FiCheck /></span>
              <span className={s.itemText}>
                Da seguimiento a trámites con <strong>estatus</strong> y fechas claras.
              </span>
            </li>
          </ul>

          <div className={s.ctas}>
            <a className={s.btnPrimary} href={androidHref} aria-label="Google Play">
              <span className={s.btnTop}>Disponible en</span>
              <span className={s.btnMain}>Google Play</span>
              <span className={s.btnIcon} aria-hidden="true"><FiArrowUpRight /></span>
            </a>

            <a className={s.btn} href={iosHref} aria-label="App Store">
              <span className={s.btnTop}>Disponible en</span>
              <span className={s.btnMain}>App Store</span>
              <span className={s.btnIcon} aria-hidden="true"><FiArrowUpRight /></span>
            </a>
          </div>

          <p className={s.note} aria-hidden="true">
            Tip: inicia sesión con tu cuenta y verás tu información sincronizada.
          </p>
        </div>

        <div className={s.right}>
          <div className={s.mediaCard}>
            <img className={s.phoneImg} src={phoneImg} alt={phoneAlt} loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}