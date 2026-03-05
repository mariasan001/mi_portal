'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import s from './AuthSplitLayout.module.css';

type Props = {
  leftTag?: string;
  leftTitle: string;
  leftDescription?: string;
  leftImageSrc?: string;
  logoSrc?: string;
  logoAlt?: string;

  bottomLeft?: ReactNode;
  bottomRight?: ReactNode;

  children: ReactNode;
};

export default function AuthSplitLayout({
  leftTag = 'Portal de Servicios',
  leftTitle,
  leftDescription,
  leftImageSrc,
  logoSrc = '/img/logo_principal.png',
  logoAlt = 'Logo institucional',
  bottomLeft,
  bottomRight,
  children,
}: Props) {
  return (
    <main className={s.page}>
      <div className={s.container}>
        {/* IZQUIERDA */}
        <section className={s.leftPanel}>
          {leftImageSrc ? (
            <div className={s.leftImgWrap} aria-hidden="true">
              <Image src={leftImageSrc} alt="" fill priority className={s.leftImg} />
            </div>
          ) : null}

          <div className={s.leftContent}>
            <div className={s.leftTag}>{leftTag}</div>
            <h1 className={s.leftTitle}>{leftTitle}</h1>
            {leftDescription ? <p className={s.leftSub}>{leftDescription}</p> : null}
            <div className={s.leftFoot}>© 2026 Gobierno del Estado de México</div>
          </div>
        </section>

        {/* DERECHA */}
        <section className={s.rightPanel}>
          <div className={s.logoBox}>
            <Image src={logoSrc} alt={logoAlt} width={130} height={50} priority />
          </div>

          <div className={s.rightCenter}>
            {children}

            {(bottomLeft || bottomRight) ? (
              <div className={s.metaRow}>
                <span>{bottomLeft}</span>
                <span>{bottomRight}</span>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}