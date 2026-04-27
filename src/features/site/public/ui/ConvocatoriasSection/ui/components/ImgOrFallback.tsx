'use client';

import Image from 'next/image';
import { useMemo } from 'react';

import { placeholderDataUri } from '../../model/convocatorias.utils';
import css from '../../ConvocatoriasSection.module.css';

type Props = {
  src?: string;
  alt: string;
};

export default function ImgOrFallback({ src, alt }: Props) {
  const fallback = useMemo(() => placeholderDataUri(), []);
  const finalSrc = src ?? fallback;

  return (
    <div className={css.postImgWrap}>
      <Image
        src={finalSrc}
        alt={alt}
        fill
        sizes="(max-width: 980px) 78vw, 420px"
        className={css.postImg}
        unoptimized={finalSrc.startsWith('data:image')}
        priority={false}
      />
    </div>
  );
}
