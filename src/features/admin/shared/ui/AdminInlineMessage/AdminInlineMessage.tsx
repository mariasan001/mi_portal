import s from './AdminInlineMessage.module.css';
import { cx } from '@/utils/cx';

type Props = {
  title: string;
  children: string;
  tone?: 'error' | 'info';
  className?: string;
};

export default function AdminInlineMessage({
  title,
  children,
  tone = 'info',
  className,
}: Props) {
  return (
    <div className={cx(s.message, s[tone], className)} role={tone === 'error' ? 'alert' : undefined}>
      <span className={s.title}>{title}</span>
      <p className={s.body}>{children}</p>
    </div>
  );
}
