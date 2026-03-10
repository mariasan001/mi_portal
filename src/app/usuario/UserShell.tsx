// src/app/usuario/UserShell.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import s from './UserShell.module.css';

type Props = {
  title?: string;
  children: React.ReactNode;
};

export default function UserShell({ title = 'Inicio', children }: Props) {
  return (
    <div className={s.shell}>
      <header className={s.header}>
        <div className={s.brand}>
          <Image
            src="/img/logo_principal.png"
            alt="Logo institucional"
            width={130}
            height={50}
            priority
          />
          <div className={s.brandText}>
            <div className={s.brandTop}>Portal de Servicios</div>
            <div className={s.brandBottom}>{title}</div>
          </div>
        </div>

        <nav className={s.nav}>
          <Link className={s.link} href="/usuario">
            Inicio
          </Link>
          <Link className={s.linkMuted} href="/privacidad">
            Aviso de privacidad
          </Link>
        </nav>
      </header>

      <main className={s.main}>
        <div className={s.container}>{children}</div>
      </main>

      <footer className={s.footer}>
        <span>© {new Date().getFullYear()} Gobierno del Estado de México</span>
      </footer>
    </div>
  );
}