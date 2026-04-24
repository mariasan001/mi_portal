'use client';

import Link from 'next/link';

import type { NavItem } from '../../model/nav.types';
import css from '../../../Components/Nav/SiteNav.module.css';

type Props = {
  items: NavItem[];
  mobile?: boolean;
  authenticated?: boolean;
  onItemClick?: () => void;
};

export function NavLinks({
  items,
  mobile = false,
  authenticated = false,
  onItemClick,
}: Props) {
  if (mobile) {
    return (
      <>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={css.mobileLink}
            onClick={onItemClick}
          >
            {item.label}
          </Link>
        ))}
      </>
    );
  }

  return (
    <>
      {items.map((item, index) => (
        <Link
          key={item.href}
          href={item.href}
          className={`${css.pillLink} ${authenticated ? css.authPillLink : ''}`}
          onClick={onItemClick}
          style={authenticated ? { animationDelay: `${index * 55}ms` } : undefined}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}
