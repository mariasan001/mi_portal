// src/features/site/Components/ConvocatoriasSection/ui/ImgOrFallback.tsx
'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import css from '../ConvocatoriasSection.module.css';
import { placeholderDataUri } from '../utils/convocatoriasUtils';

type Props = { src?: string; alt: string };

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