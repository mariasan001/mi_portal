import type { LucideIcon } from 'lucide-react';

import { cx } from '@/utils/cx';
import s from './NominaHero.module.css';

type HeroBadge = {
  icon: LucideIcon;
  label: string;
};

type Props = {
  badges: readonly HeroBadge[];
  kicker: string;
  spacious?: boolean;
  subtitle: string;
  title: string;
};

export default function NominaHero({
  badges,
  kicker,
  spacious = false,
  subtitle,
  title,
}: Props) {
  return (
    <header className={cx(s.hero, s.enter, spacious && s.spacious)}>
      <div className={s.headerTop}>
        <span className={cx(s.kicker, s.enterLeft)}>{kicker}</span>

        <div className={cx(s.metaBadges, s.enterSoft)}>
          {badges.map((badge) => {
            const Icon = badge.icon;

            return (
              <span key={badge.label} className={s.metaBadge}>
                <Icon size={spacious ? 13 : 14} />
                {badge.label}
              </span>
            );
          })}
        </div>
      </div>

      <div className={s.content}>
        <h1 className={cx(s.title, s.enterSoft)}>{title}</h1>
        <p className={cx(s.subtitle, s.enterSoftDelay)}>{subtitle}</p>
      </div>
    </header>
  );
}
