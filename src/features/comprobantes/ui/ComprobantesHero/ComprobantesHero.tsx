import s from './ComprobantesHero.module.css';

type Props = {
  displayName: string;
};

export default function ComprobantesHero({ displayName }: Props) {
  return (
    <header className={s.head}>
      <h1 className={s.title}>
        Hola, <span className={s.titleAccent}>{displayName}.</span>
      </h1>

      <p className={s.subtitleStrong}>Nos da mucho gusto tenerte aquí.</p>

      <p className={s.subtitle}>
        Desde este <strong>portal podrás consultar tus comprobantes, constancias, movimientos</strong> de
        personal y demás servicios digitales disponibles para ti.
      </p>
    </header>
  );
}