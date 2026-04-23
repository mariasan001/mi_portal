'use client';

import { MessageCircleMore } from 'lucide-react';

import s from './AdminFloatingBubble.module.css';

export default function AdminFloatingBubble() {
  return (
    <button
      type="button"
      className={s.bubble}
      aria-label="Acceso rapido"
      title="Acceso rapido"
    >
      <span className={s.pulse} aria-hidden="true" />
      <span className={s.inner}>
        <MessageCircleMore size={20} strokeWidth={2.1} />
      </span>
    </button>
  );
}
