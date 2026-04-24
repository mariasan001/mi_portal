import type { ReactNode } from 'react';
import { cx } from '@/utils/cx';
import s from './AdminSurface.module.css';

type Props = {
  children: ReactNode;
  className?: string;
  idle?: boolean;
  dimmed?: boolean;
  as?: 'section' | 'div';
};

export default function AdminSurface({
  children,
  className,
  idle = false,
  dimmed = false,
  as = 'section',
}: Props) {
  const Tag = as;

  return (
    <Tag className={cx(s.surface, idle && s.idle, dimmed && s.dimmed, className)}>
      {children}
    </Tag>
  );
}
