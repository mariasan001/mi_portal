'use client';

import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import LoginForm from '../LoginForm/LoginForm';
import s from './AuthModal.module.css';

import { useLoginFlow } from '@/features/auth/hooks/useLoginFlow';
import { useAuth } from '@/features/auth/context/auth.context';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AuthModal({ open, onClose }: Props) {
  const {
    username,
    setUsername,
    password,
    setPassword,
    onSubmit,
    loading,
    error,
  } = useLoginFlow();

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!open) return;

    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open, onClose]);

  useEffect(() => {
    if (open && isAuthenticated) {
      onClose();
    }
  }, [open, isAuthenticated, onClose]);

  if (!open) return null;

  return createPortal(
    <div className={s.overlay} onClick={onClose}>
      <div
        className={s.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <LoginForm
          username={username}
          password={password}
          onUsernameChange={setUsername}
          onPasswordChange={setPassword}
          onSubmit={onSubmit}
          loading={loading}
          error={error}
        />
      </div>
    </div>,
    document.body
  );
}

/* Este es el modal  */