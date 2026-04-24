

import { ChevronUp, ShieldCheck, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import s from './NominaRecibosReleasePanel.module.css';

type Props = {
  versionId: string;
  releasedByUserId: string;
  comments: string;
  loading: boolean;
  canExecute: boolean;
  onChangeVersionId: (value: string) => void;
  onChangeReleasedByUserId: (value: string) => void;
  onChangeComments: (value: string) => void;
  onExecute: () => void;
};

export default function NominaRecibosReleasePanel({
  versionId,
  releasedByUserId,
  comments,
  loading,
  canExecute,
  onChangeVersionId,
  onChangeReleasedByUserId,
  onChangeComments,
  onExecute,
}: Props) {
  const shouldReduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node | null;
      if (!panelRef.current || !target) return;

      if (!panelRef.current.contains(target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className={s.backdrop}
            aria-hidden="true"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.18 }}
          />
        ) : null}
      </AnimatePresence>

      <div className={s.floatingDock}>
        <AnimatePresence initial={false} mode="wait">
          {!isOpen ? (
            <motion.button
              key="bubble"
              type="button"
              className={s.bubble}
              onClick={() => setIsOpen(true)}
              initial={
                shouldReduceMotion ? false : { opacity: 0, scale: 0.94, y: 10 }
              }
              animate={
                shouldReduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }
              }
              exit={
                shouldReduceMotion ? undefined : { opacity: 0, scale: 0.96, y: 8 }
              }
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : { y: -2, transition: { duration: 0.16 } }
              }
              whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
              aria-label="Abrir liberación de versión"
            >
              <span className={s.bubbleIcon}>
                <ShieldCheck size={16} />
              </span>

              <span className={s.bubbleCopy}>
                <strong>Liberación de versión</strong>
                <small>Acción independiente</small>
              </span>

              <span className={s.bubbleArrow}>
                <ChevronUp size={16} />
              </span>
            </motion.button>
          ) : (
            <motion.section
              key="panel"
              ref={panelRef}
              className={s.panel}
              initial={
                shouldReduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }
              }
              animate={
                shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }
              }
              exit={
                shouldReduceMotion ? undefined : { opacity: 0, y: 10, scale: 0.985 }
              }
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Liberación de versión"
            >
              <div className={s.panelTop}>
                <div className={s.panelHead}>
                  <div className={s.headerIcon}>
                    <ShieldCheck size={16} />
                  </div>

                  <div className={s.headerCopy}>
                    <span className={s.kicker}>Acción independiente</span>
                    <h3>Liberación de versión</h3>
                    <p>
                      Ejecuta la liberación cuando operación lo determine, sin
                      depender del flujo principal.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className={s.closeBtn}
                  onClick={() => setIsOpen(false)}
                  aria-label="Cerrar liberación"
                >
                  <X size={16} />
                </button>
              </div>

              <div className={s.grid}>
                <div className={s.field}>
                  <label className={s.label} htmlFor="nomina-release-version-id">
                    Version ID
                  </label>

                  <div className={s.inputWrap}>
                    <input
                      id="nomina-release-version-id"
                      type="number"
                      min="1"
                      value={versionId}
                      onChange={(e) => onChangeVersionId(e.target.value)}
                      placeholder="Ej. 125"
                    />
                  </div>
                </div>

                <div className={s.field}>
                  <label
                    className={s.label}
                    htmlFor="nomina-released-by-user-id"
                  >
                    Released By User ID
                  </label>

                  <div className={s.inputWrap}>
                    <input
                      id="nomina-released-by-user-id"
                      type="number"
                      min="1"
                      value={releasedByUserId}
                      onChange={(e) => onChangeReleasedByUserId(e.target.value)}
                      placeholder="Ej. 18"
                    />
                  </div>
                </div>

                <div className={`${s.field} ${s.full}`}>
                  <label className={s.label} htmlFor="nomina-release-comments">
                    Comentarios
                  </label>

                  <div className={s.textareaWrap}>
                    <textarea
                      id="nomina-release-comments"
                      rows={4}
                      value={comments}
                      onChange={(e) => onChangeComments(e.target.value)}
                      placeholder="Comentario opcional o referencia operativa."
                    />
                  </div>
                </div>
              </div>

              <div className={s.actions}>
                <motion.button
                  type="button"
                  className={s.releaseBtn}
                  onClick={onExecute}
                  disabled={!canExecute || loading}
                  whileHover={
                    shouldReduceMotion || !canExecute || loading
                      ? undefined
                      : { y: -1, transition: { duration: 0.16 } }
                  }
                  whileTap={
                    shouldReduceMotion || !canExecute || loading
                      ? undefined
                      : { scale: 0.99 }
                  }
                >
                  {loading ? 'Liberando...' : 'Liberar versión'}
                </motion.button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}