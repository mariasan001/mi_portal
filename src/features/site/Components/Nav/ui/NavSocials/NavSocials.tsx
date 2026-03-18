'use client';

import { FaFacebookF, FaXTwitter } from 'react-icons/fa6';
import css from './SiteNav.module.css';
import { SOCIAL_LINKS } from '../../constants/nav';

const SOCIAL_ICONS = {
  Facebook: <FaFacebookF />,
  X: <FaXTwitter />,
};

type Props = {
  className?: string;
  ariaLabel?: string;
};

export default function NavSocials({
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