import s from './NominaRecibosHero.module.css';

export default function NominaRecibosHero() {
  return (
    <section className={s.hero}>
      <div className={s.content}>
        <p className={s.eyebrow}>Administración de nómina</p>
        <h1>Recibos, liberación y sincronización</h1>
        <p className={s.description}>
          Ejecuta el flujo operativo sobre una versión: snapshots, generación de
          recibos, liberación y sincronización complementaria a core, dentro de
          una misma sesión visual y administrativa.
        </p>
      </div>
    </section>
  );
}