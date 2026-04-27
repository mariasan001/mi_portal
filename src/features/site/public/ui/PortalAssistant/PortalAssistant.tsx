'use client';

import { useEffect, useMemo, useState } from 'react';
import { FiArrowUpRight, FiMessageCircle, FiSearch, FiX } from 'react-icons/fi';

import s from './PortalAssistant.module.css';
import { useAuth } from '@/features/auth';

type AssistantAction = 'tramite' | 'consulta' | 'password';

type AssistantIntent = {
  id: AssistantAction;
  title: string;
  hint: string;
  keywords: string[];
};

function emitAssistantNavigate(action: AssistantAction) {
  window.dispatchEvent(
    new CustomEvent('portal-assistant:navigate', {
      detail: { action },
    })
  );
}

export default function PortalAssistant() {
  const { isAuthenticated } = useAuth();

  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [query, setQuery] = useState('');

  const intents = useMemo<AssistantIntent[]>(
    () => [
      {
        id: 'tramite',
        title: 'Hacer un trámite',
        hint: 'Te llevo a la sección para iniciar un trámite.',
        keywords: ['tramite', 'trámite', 'solicitud', 'proceso', 'gestión'],
      },
      {
        id: 'consulta',
        title: 'Realizar una consulta',
        hint: 'Encuentra información y opciones de consulta.',
        keywords: ['consulta', 'información', 'informacion', 'buscar', 'ayuda'],
      },
      {
        id: 'password',
        title: 'Recuperar contraseña',
        hint: 'Accede a la recuperación de tu cuenta.',
        keywords: ['contraseña', 'password', 'clave', 'acceso', 'cuenta'],
      },
    ],
    []
  );

  const filteredIntents = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) return [];

    return intents.filter((item) => {
      return (
        item.title.toLowerCase().includes(term) ||
        item.hint.toLowerCase().includes(term) ||
        item.keywords.some((keyword) => keyword.toLowerCase().includes(term))
      );
    });
  }, [intents, query]);

  useEffect(() => {
    if (!isAuthenticated || dismissed) return;

    const showTimer = window.setTimeout(() => {
      setVisible(true);
    }, 1800);

    return () => {
      window.clearTimeout(showTimer);
    };
  }, [isAuthenticated, dismissed]);

  if (!isAuthenticated || dismissed || !visible) return null;

  const hasQuery = query.trim().length > 0;

  return (
    <div className={s.wrap} aria-live="polite">
      <section className={`${s.panel} ${open ? s.panelOpen : ''}`} aria-hidden={!open}>
        <header className={s.header}>
          <div className={s.headerInfo}>
            <span className={s.avatar}>
              <FiMessageCircle />
            </span>

            <div className={s.headerText}>
              <span className={s.kicker}>Asistente</span>
              <h3 className={s.title}>¿Qué necesitas?</h3>
            </div>
          </div>

          <button
            type="button"
            className={s.iconBtn}
            aria-label="Cerrar asistente"
            onClick={() => {
              setOpen(false);
              setQuery('');
            }}
          >
            <FiX />
          </button>
        </header>

        <div className={s.chat}>
          <div className={s.messageRow}>
            <div className={`${s.bubble} ${s.bubbleAssistant}`}>
              <p className={s.bubbleTitle}>Hola</p>
              <p className={s.bubbleText}>
                Escríbeme lo que necesitas y te llevo a la opción correcta del portal.
              </p>
            </div>
          </div>

          {hasQuery && (
            <>
              <div className={s.messageRowUser}>
                <div className={`${s.bubble} ${s.bubbleUser}`}>{query}</div>
              </div>

              <div className={s.messageRow}>
                <div className={`${s.bubble} ${s.bubbleAssistantSoft}`}>
                  {filteredIntents.length > 0 ? (
                    <>
                      <p className={s.bubbleLabel}>Encontré estas opciones</p>

                      <div className={s.suggestionList}>
                        {filteredIntents.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            className={s.suggestionItem}
                            onClick={() => {
                              emitAssistantNavigate(item.id);
                              setOpen(false);
                              setQuery('');
                            }}
                          >
                            <span className={s.suggestionMain}>
                              <span className={s.suggestionTitle}>{item.title}</span>
                              <span className={s.suggestionHint}>{item.hint}</span>
                            </span>

                            <span className={s.suggestionArrow}>
                              <FiArrowUpRight />
                            </span>
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <p className={s.bubbleLabel}>No encontré una opción exacta</p>
                      <p className={s.bubbleText}>
                        Prueba con palabras como trámite, consulta, acceso o contraseña.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className={s.inputBar}>
          <div className={s.inputWrap}>
            <FiSearch className={s.inputIcon} />
            <input
              type="text"
              className={s.input}
              placeholder="Escribe aquí lo que necesitas..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>
      </section>

      <div className={s.floating}>
        {open && (
          <button
            type="button"
            className={s.hideBtn}
            aria-label="Ocultar asistente"
            onClick={() => setDismissed(true)}
          >
            Ocultar
          </button>
        )}

        <button
          type="button"
          className={`${s.trigger} ${open ? s.triggerActive : ''}`}
          aria-label={open ? 'Cerrar asistente' : 'Abrir asistente'}
          onClick={() =>
            setOpen((prev) => {
              const nextOpen = !prev;
              if (!nextOpen) {
                setQuery('');
              }
              return nextOpen;
            })
          }
        >
          <span className={s.triggerIcon}>
            <FiMessageCircle />
          </span>
          <span className={s.triggerLabel}>Ayuda</span>
        </button>
      </div>
    </div>
  );
}
