// src/features/site/Components/ConvocatoriasSection/ConvocatoriasSection.tsx
'use client';

import { useMemo, useRef, useState } from 'react';
import css from './ConvocatoriasSection.module.css';
import { useRevealMotion } from '@/hooks/useRevealMotion';

import {
  FiSearch,
  FiHeart,
  FiBookmark,
  FiArrowUpRight,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

import ImgOrFallback from './ui/ImgOrFallback';
import { useToggleSet } from './hooks/useToggleSet';
import { useConvocatoriasSearch } from './hooks/useConvocatoriasSearch';
import { useConvocatoriasCarousel } from './hooks/useConvocatoriasCarousel';

type PostCard = {
  id: string;
  title: string;
  desc: string;
  img?: string;
  tag?: string;
  href?: string;
};

export default function ConvocatoriasSection() {
  const [query, setQuery] = useState('');
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const { ref: sectionRef, className } = useRevealMotion<HTMLElement>({
    threshold: 0.25,
    thresholdPx: 2,
  });

  const posts: PostCard[] = useMemo(
    () => [
      {
        id: 'p1',
        title: '30 años dejando huella',
        desc: 'Regístrate al sistema de recompensas por permanencia antes del 30 de septiembre.',
        img: '/img/avisos/aviso_1.png',
        tag: 'Convocatoria',
        href: '#',
      },
      {
        id: 'p2',
        title: 'Nuevas reglas',
        desc: 'Consulta los nuevos lineamientos y encuentra lo que cambió este mes.',
        img: '/img/avisos/aviso_2.png',
        tag: 'Aviso',
        href: '#',
      },
      {
        id: 'p3',
        title: 'Capacítate',
        desc: 'Cursos y talleres disponibles para fortalecer tu perfil.',
        img: '/img/avisos/aviso_3.png',
        tag: 'Formación',
        href: '#',
      },
    ],
    []
  );

  const liked = useToggleSet();
  const saved = useToggleSet();

  const { results } = useConvocatoriasSearch(posts, query);

  const carousel = useConvocatoriasCarousel({ posts, scrollerRef });

  const onPickResult = (id: string) => {
    carousel.pickById(id);
    setQuery(''); // snappy
  };

  return (
    <section
      ref={sectionRef}
      className={className(css.wrap, css.isIn, css.dirDown, css.dirUp)}
      aria-label="Convocatorias en marcha"
      onMouseEnter={() => carousel.setPaused(true)}
      onMouseLeave={() => carousel.setPaused(false)}
      onFocusCapture={() => carousel.setPaused(true)}
      onBlurCapture={() => carousel.setPaused(false)}
    >
      <div className={css.inner}>
        <div className={css.left}>
          <div className={css.kicker}>Convocatorias en marcha:</div>

          <h2 className={css.title}>
            <span className={css.titleStrong}>¡Participa!</span>
          </h2>

          <p className={css.subtitle}>
            Revisa las convocatorias vigentes y no dejes pasar ninguna oportunidad.
            Capacítate, postúlate o inscríbete en los procesos abiertos.
          </p>

          <div className={css.searchWrap}>
            <div className={css.searchBar} role="search" aria-label="Buscar convocatorias">
              <span className={css.searchBarIcon} aria-hidden="true">
                <FiSearch />
              </span>

              <input
                className={css.searchBarInput}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="¿Qué necesitas hoy?"
                aria-label="Buscar"
                inputMode="search"
                autoComplete="off"
                spellCheck={false}
              />

              <button
                type="button"
                className={css.searchBarBtn}
                onClick={() => carousel.setPaused(true)}
              >
                Buscar
              </button>
            </div>

            <div className={css.results} data-open={results.length ? '1' : '0'} role="listbox">
              {results.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={css.resultItem}
                  onClick={() => onPickResult(r.id)}
                  aria-label={`Ir a ${r.title}`}
                >
                  <span className={css.resultTag}>{r.tag ?? 'Resultado'}</span>
                  <span className={css.resultTitle}>{r.title}</span>
                  <span className={css.resultDesc}>{r.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={css.right}>
          <div className={css.railTop}>
            <div className={css.railTitle}>Destacados</div>

            <div className={css.navBtns}>
              <button
                type="button"
                className={css.navBtn}
                aria-label="Anterior"
                onClick={() => carousel.scrollByCard(-1)}
              >
                <FiChevronLeft />
              </button>

              <button
                type="button"
                className={css.navBtn}
                aria-label="Siguiente"
                onClick={() => carousel.scrollByCard(1)}
              >
                <FiChevronRight />
              </button>
            </div>
          </div>

          <div className={css.rail}>
            <div
              className={css.scroller}
              ref={scrollerRef}
              role="list"
              aria-label="Carrusel de convocatorias"
              onPointerDown={() => carousel.setPaused(true)}
              onPointerUp={() => carousel.setPaused(false)}
            >
              {posts.map((p, idx) => {
                const isLiked = liked.has(p.id);
                const isSaved = saved.has(p.id);

                return (
                  <article
                    key={p.id}
                    className={css.post}
                    data-post
                    style={{ ['--d' as unknown as string]: `${idx * 70}ms` }}
                    role="listitem"
                    aria-label={p.title}
                  >
                    <div className={css.postMedia}>
                      <ImgOrFallback src={p.img} alt={p.title} />
                      {p.tag ? <span className={css.badge}>{p.tag}</span> : null}

                      <div className={css.actions}>
                        <button
                          type="button"
                          className={css.actionBtn}
                          aria-label="Me gusta"
                          aria-pressed={isLiked}
                          data-active={isLiked ? '1' : '0'}
                          onClick={() => liked.toggle(p.id)}
                        >
                          <FiHeart />
                        </button>

                        <button
                          type="button"
                          className={css.actionBtn}
                          aria-label="Guardar"
                          aria-pressed={isSaved}
                          data-active={isSaved ? '1' : '0'}
                          onClick={() => saved.toggle(p.id)}
                        >
                          <FiBookmark />
                        </button>
                      </div>
                    </div>

                    <div className={css.postBody}>
                      <h3 className={css.postTitle}>{p.title}</h3>
                      <p className={css.postDesc}>{p.desc}</p>

                      <a className={css.postCta} href={p.href ?? '#'} aria-label={`Ver más: ${p.title}`}>
                        <span>Ver detalles</span>
                        <span className={css.ctaArrow} aria-hidden="true">
                          <FiArrowUpRight />
                        </span>
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className={css.dots} aria-label="Indicadores de carrusel">
            {posts.map((p, i) => (
              <button
                key={p.id}
                type="button"
                className={css.dot}
                aria-label={`Ir a ${i + 1}`}
                aria-current={i === carousel.active ? 'true' : 'false'}
                data-active={i === carousel.active ? '1' : '0'}
                onClick={() => carousel.scrollToIndex(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}