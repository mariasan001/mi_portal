import Link from 'next/link';
import css from './site.module.css';

export default function SiteFooter() {
  return (
    <footer className={css.footer}>
      <div className={css.footerInner}>
        <div className={css.footerBrand}>
          <div className={css.footerTitle}>Portal de Servicios</div>
          <div className={css.footerSub}>Gobierno del Estado de México</div>
        </div>

        <div className={css.footerLinks}>
          <Link href="/aviso-privacidad">Aviso de privacidad</Link>
          <Link href="/terminos">Términos</Link>
          <Link href="/contacto">Contacto</Link>
        </div>

        <div className={css.footerCopy}>
          © {new Date().getFullYear()} Estado de México
        </div>
      </div>
    </footer>
  );
}
