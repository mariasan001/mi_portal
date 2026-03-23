import s from './NominaConfigHero.module.css';

export default function NominaConfigHero() {
  return (
    <header className={s.hero}>
      <div>
        <span className={s.kicker}>Nómina</span>
        <h1 className={s.title}>Gestión de periodo y versión</h1>
        <p className={s.subtitle}>
          Consulta, crea y organiza la configuración base del procesamiento de
          nómina desde una sola sesión.
        </p>
      </div>
    </header>
  );
}