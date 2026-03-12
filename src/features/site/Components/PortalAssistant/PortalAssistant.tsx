'use client';

import { useEffect, useState } from 'react';
import { FiHelpCircle, FiMessageCircle, FiSearch, FiShield, FiX } from 'react-icons/fi';

import s from './PortalAssistant.module.css';
import { useAuth } from '@/features/auth';

type AssistantAction = 'tramite' | 'consulta' | 'password';

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
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || dismissed) return;

    const showTimer = window.setTimeout(() => {
      setVisible(true);
      setBubbleOpen(true);
    }, 2500);

    const closeBubbleTimer = window.setTimeout(() => {
      setBubbleOpen(false);
    }, 7000);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(closeBubbleTimer);
    };
  }, [isAuthenticated, dismissed]);

  if (!visible || !isAuthenticated) return null;

  return (
    <div className={s.wrap} aria-live="polite">
      <div className={`${s.tooltip} ${bubbleOpen ? s.tooltipOpen : ''}`}>
        <div className={s.tooltipContent}>
          <p className={s.title}>¿Qué proceso quieres realizar hoy?</p>
          <p className={s.text}>
            Puedo llevarte directamente a la sección adecuada del portal.
          </p>

          <div className={s.actions}>
            <button
              type="button"
              className={s.actionBtn}
              onClick={() => {
                emitAssistantNavigate('tramite');
                setBubbleOpen(false);
              }}
            >
              <FiSearch />
              Hacer un trámite
            </button>

            <button
              type="button"
              className={s.actionBtn}
              onClick={() => {
                emitAssistantNavigate('consulta');
                setBubbleOpen(false);
              }}
            >
              <FiHelpCircle />
              Realizar una consulta
            </button>

            <button
              type="button"
              className={s.actionBtn}
              onClick={() => {
                emitAssistantNavigate('password');
                setBubbleOpen(false);
              }}
            >
              <FiShield />
              Recuperar mi contraseña
            </button>
          </div>
        </div>

        <button
          type="button"
          className={s.closeBubble}
          aria-label="Cerrar mensaje"
          onClick={() => setBubbleOpen(false)}
        >
          <FiX />
        </button>
      </div>

      <button
        type="button"
        className={s.assistant}
        aria-label="Abrir asistente"
        onClick={() => setBubbleOpen((prev) => !prev)}
      >
        <FiMessageCircle />
      </button>

      <button
        type="button"
        className={s.dismiss}
        aria-label="Ocultar asistente"
        onClick={() => setDismissed(true)}
      />
    </div>
  );
}