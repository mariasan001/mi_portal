import Link from 'next/link';
import { FiArrowUpRight } from 'react-icons/fi';

import type { ComprobanteAccessItem } from '../../constants/comprobantesConstants';
import s from './ComprobantesAccessCard.module.css';

type Props = {
  item: ComprobanteAccessItem;
};

export default function ComprobantesAccessCard({ item }: Props) {
  const Icon = item.icon;

  return (
    <article className={s.card}>
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