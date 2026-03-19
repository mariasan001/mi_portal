'use client';

import { FiArrowUpRight } from 'react-icons/fi';
import { useRevealMotion } from '@/hooks/useRevealMotion';

import type { ComprobanteAccessItem } from '../../constants/comprobantesConstants';
import s from './ComprobantesAccessCard.module.css';

type Props = {
  item: ComprobanteAccessItem;
  index?: number;
  onSelect: (key: ComprobanteAccessItem['key']) => void;
};

/**
 * Card individual del menú de accesos.
 */
export default function ComprobantesAccessCard({
  item,
  index = 0,
  onSelect,
}: Props) {
  const Icon = item.icon;

  const { ref, className } = useRevealMotion<HTMLElement>({
    threshold: 0.18,
    thresholdPx: 8,
  });

  return (
    <article
      ref={ref}
      className={className(s.card, s.isIn, s.dirDown, s.dirUp)}
      style={{ ['--card-delay' as string]: `${index * 80}ms` }}
    >
      <div className={s.iconWrap} aria-hidden="true">
        <span className={s.icon}>
          <Icon />
        </span>
      </div>

      <h2 className={s.cardTitle}>{item.title}</h2>
      <p className={s.cardDesc}>{item.desc}</p>

      <button
        type="button"
        className={s.cardCta}
        onClick={() => onSelect(item.key)}
      >
        <span>{item.cta}</span>

        <span className={s.ctaArrow} aria-hidden="true">
          <FiArrowUpRight />
        </span>
      </button>
    </article>
  );
}