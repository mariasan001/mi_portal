import s from './EmptyState.module.css';

type Props = {
  title: string;
  description: string;
};

export default function EmptyState({ title, description }: Props) {
  return (
    <section className={s.emptyState}>
      <div className={s.inner}>
        <span className={s.badge}>Sin ejecución todavía</span>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </section>
  );
}