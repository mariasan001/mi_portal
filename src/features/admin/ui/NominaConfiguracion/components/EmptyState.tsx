import s from './EmptyState.module.css';

type Props = {
  title: string;
  description: string;
};

export default function EmptyState({ title, description }: Props) {
  return (
    <div className={s.empty}>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
}