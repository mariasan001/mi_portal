'use client';

import Image from 'next/image';
import Link from 'next/link';
import css from '../../SiteNav.module.css';

export default function NavLogo() {
  return (
    <Link href="/" className={css.pillLogoFree} aria-label="Inicio">
      <span className={css.logoFullWrap} aria-hidden="true">
        <Image
          src="/img/logo_principal.png"
          alt=""
          width={180}
          height={72}
          priority
          className={`${css.logoFull} ${css.fullNormal}`}
        />
        <Image
          src="/img/logo_gob.png"
          alt=""
          width={180}
          height={72}
          priority
          className={`${css.logoFull} ${css.fullVeda}`}
        />
      </span>

      <span className={css.logoChip} aria-hidden="true">
        <Image
          src="/img/colibri.png"
          alt=""
          width={64}
          height={64}
          priority
          className={`${css.logoIcon} ${css.compactNormal}`}
        />
        <Image
          src="/img/escudo.png"
          alt=""
          width={64}
          height={64}
          priority
          className={`${css.logoIcon} ${css.compactVeda}`}
        />
      </span>
    </Link>
  );
}