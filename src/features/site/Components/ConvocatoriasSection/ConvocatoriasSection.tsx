// src/features/site/Components/ConvocatoriasSection/ConvocatoriasSection.tsx
'use client';

import { useMemo, useRef, useState } from 'react';
import css from './ConvocatoriasSection.module.css';
import {
  FiSearch,
  FiHeart,
  FiBookmark,
  FiArrowUpRight,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

type PostCard = {
  id: string;
  title: string;
  desc: string;
  img?: string; // ✅ opcional
  tag?: string;
  href?: string;
};

function placeholderDataUri() {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720">
    <rect width="1200" height="720" fill="#ffffff"/>
    <rect x="18" y="18" width="1164" height="684" rx="18" ry="18" fill="#ffffff" stroke="#e5e7eb" stroke-width="6"/>

    <!-- icono tipo "sin imagen" -->
    <g transform="translate(0,0)" fill="#d1d5db">
      <!-- montañita -->
      <path d="M420 460
               L520 340
               Q540 320 560 340
               L650 450
               Q670 470 650 490
               L440 490
               Q410 490 420 460Z" opacity="0.95"/>
      <!-- sol -->
      <circle cx="720" cy="330" r="44" opacity="0.95"/>
    </g>
  </svg>`.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}


function ImgOrFallback({ src, alt }: { src?: string; alt: string }) {
  const fallback = useMemo(() => placeholderDataUri(), []);
  const [currentSrc, setCurrentSrc] = useState<string>(src || fallback);

  useMemo(() => {
    // eslint-disable-next-line react-hooks/set-state-in-render
    setCurrentSrc(src || fallback);
    return null;
  }, [src, fallback]);

  return (
    <img
      className={css.postImg}
      src={currentSrc}
      alt={alt}
      loading="lazy"
      onError={() => setCurrentSrc(fallback)}
    />
  );
}


export default function ConvocatoriasSection() {
  const [query, setQuery] = useState('');
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const posts: PostCard[] = useMemo(
    () => [
      {
        id: 'p1',
        title: '30 años dejando huella',
        desc: 'Regístrate al sistema de recompensas por permanencia antes del 30 de septiembre.',
        img: '/img/conv_1.png',
        tag: 'Convocatoria',
        href: '#',
      },
      {
        id: 'p2',
        title: 'Nuevas reglas',
        desc: 'Consulta los nuevos lineamientos y encuentra lo que cambió este mes.',
        img: '/img/conv_2.png',
        tag: 'Aviso',
        href: '#',
      },
      {
        id: 'p3',
        title: 'Capacítate',
        desc: 'Cursos y talleres disponibles para fortalecer tu perfil.',
        img: '/img/conv_3.png',
        tag: 'Formación',
        href: '#',
      },
    ],
    []
  );

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;

    const first = el.querySelector<HTMLElement>(`.${css.post}`);
    const step = first ? first.offsetWidth + 18 : 320;
    el.scrollBy({ left: step * dir, behavior: 'smooth' });
  };

  return (
    <section className={css.wrap} aria-label="Convocatorias en marcha">
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

            <button type="button" className={css.searchBarBtn}>
              Buscar
            </button>
          </div>

          <div className={css.helperRow} aria-hidden="true">
            <span className={css.pill}>Becas</span>
            <span className={css.pill}>Capacitación</span>
            <span className={css.pill}>Reconocimientos</span>
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
                onClick={() => scrollByCard(-1)}
              >
                <FiChevronLeft />
              </button>
              <button
                type="button"
                className={css.navBtn}
                aria-label="Siguiente"
                onClick={() => scrollByCard(1)}
              >
                <FiChevronRight />
              </button>
            </div>
          </div>

          <div className={css.scroller} ref={scrollerRef} role="list" aria-label="Carrusel de convocatorias">
            {posts.map((p, idx) => (
              <article
                key={p.id}
                className={css.post}
                style={{ ['--d' as unknown as string]: `${idx * 70}ms` }}
                role="listitem"
              >
                <div className={css.postMedia}>
                  <ImgOrFallback src={p.img} alt={p.title} />
                  {p.tag ? <span className={css.badge}>{p.tag}</span> : null}

                  <div className={css.actions}>
                    <button type="button" className={css.actionBtn} aria-label="Me gusta">
                      <FiHeart />
                    </button>
                    <button type="button" className={css.actionBtn} aria-label="Guardar">
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
            ))}
          </div>

          <div className={css.dots} aria-hidden="true">
            <span className={css.dot} />
            <span className={css.dot} />
            <span className={css.dot} />
          </div>
        </div>
      </div>
    </section>
  );
}

