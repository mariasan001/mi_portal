import type { ReactNode } from 'react';
import { cx } from '@/utils/cx';
import s from './AdminPageShell.module.css';

type Props = {
  children: ReactNode;
  className?: string;
  stackClassName?: string;
};

export default function AdminPageShell({
  children,
  className,
  stackClassName,
}: Props) {
  return (
    <section className={cx(s.page, className)}>
      <div className={cx(s.stack, stackClassName)}>{children}</div>
    </section>
  );
}
