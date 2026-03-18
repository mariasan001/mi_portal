'use client';

import Link from 'next/link';
import { FiArrowUpRight } from 'react-icons/fi';

import type { ComprobanteAccessItem } from '../../constants/comprobantesConstants';
import { useRevealMotion } from '@/hooks/useRevealMotion';
import s from './ComprobantesAccessCard.module.css';

type Props = {
  item: ComprobanteAccessItem;
  index?: number;
};

export default function ComprobantesAccessCard({ item, index = 0 }: Props) {
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

      <Link className={s.cardCta} href={item.href}>
        <span>{item.cta}</span>

        <span className={s.ctaArrow} aria-hidden="true">
          <FiArrowUpRight />
        </span>
      </Link>
    </article>
  );
}