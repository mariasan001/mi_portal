'use client';

import { FaFacebookF, FaXTwitter } from 'react-icons/fa6';

import { SOCIAL_LINKS } from '../../model/nav.constants';
import css from '../../../Components/Nav/SiteNav.module.css';

const SOCIAL_ICONS = {
  Facebook: <FaFacebookF />,
  X: <FaXTwitter />,
};

type Props = {
  className?: string;
  ariaLabel?: string;
};

export function NavSocials({
  className = '',
  ariaLabel = 'Redes sociales',
}: Props) {
  return (
    <div className={className} aria-label={ariaLabel}>
      {SOCIAL_LINKS.map((item) => (
        <a
          key={item.label}
          className={css.socialIcon}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          aria-label={item.label}
          title={item.label}
        >
          {SOCIAL_ICONS[item.label as keyof typeof SOCIAL_ICONS]}
        </a>
      ))}
    </div>
  );
}
