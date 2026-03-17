'use client';

import { createPortal } from 'react-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';

import s from './AuthModal.module.css';

import RegisterForm from '../RegisterForm/RegisterForm';
import ForgotPasswordForm from '../ForgotPasswordForm/ForgotPasswordForm';
import VerifyOtpForm from '../VerifyOtpForm/VerifyOtpForm';
import ResetPasswordForm from '../ResetPasswordForm/ResetPasswordForm';
import { useLoginFlow } from '@/features/auth/hooks/useLoginFlow';
import { useRegister } from '@/features/auth/hooks/useRegister';
import { useAuth } from '@/features/auth/context/auth.context';
import type { RegisterPayload } from '@/features/auth/types/register.types';
import LoginForm from '../LoginForm/LoginForm';

type Props = {
  open: boolean;
  onClose: () => void;
};

type AuthView = 'login' | 'register' | 'forgot' | 'otp' | 'reset';

const INITIAL_REGISTER_VALUE: RegisterPayload = {
  claveSp: '',
  plaza: '',
  puesto: '',
  email: '',
  password: '',
  phone: '',
};

export default function AuthModal({ open, onClose }: Props) {
  const [view, setView] = useState<AuthView>('login');
  const [recoveryIdentifier, setRecoveryIdentifier] = useState('');
  const [verifiedOtp, setVerifiedOtp] = useState('');
  const [registerValue, setRegisterValue] = useState<RegisterPayload>(INITIAL_REGISTER_VALUE);

  const {
    username,
    setUsername,
    password,
    setPassword,
    onSubmit,
    loading,
    error,
  } = useLoginFlow();

  const {
    loading: registerLoading,
    error: registerError,
    data: registerData,
    submit: submitRegister,
    reset: resetRegisterState,
  } = useRegister();

  const { isAuthenticated } = useAuth();

  const registerSuccess = useMemo(() => {
    if (!registerData) return null;
    return registerData.message ?? 'Registro exitoso. Ya puedes iniciar sesión.';
  }, [registerData]);

  /**
   * Limpia el estado interno del flujo auth.
   */
  const resetFlowState = useCallback(() => {
    setView('login');
    setRecoveryIdentifier('');
    setVerifiedOtp('');
    setRegisterValue(INITIAL_REGISTER_VALUE);
    resetRegisterState();
  }, [resetRegisterState]);

  /**
   * Cierre centralizado del modal.
   */
  const handleClose = useCallback(() => {
    resetFlowState();
    onClose();
  }, [onClose, resetFlowState]);

  function handleGoToLogin() {
    setView('login');
    setVerifiedOtp('');
  }

  function handleGoToRegister() {
    setView('register');
  }

  function handleGoToForgot(prefill?: string) {
    setRecoveryIdentifier((prefill ?? '').trim());
    setVerifiedOtp('');
    setView('forgot');
  }

  function handleGoToOtp(identifier?: string) {
    setRecoveryIdentifier((identifier ?? recoveryIdentifier).trim());
    setView('otp');
  }

  function handleGoToReset(identifier?: string, otp?: string) {
    setRecoveryIdentifier((identifier ?? recoveryIdentifier).trim());
    setVerifiedOtp((otp ?? verifiedOtp).trim());
    setView('reset');
  }

  function handleRegisterChange<K extends keyof RegisterPayload>(
    key: K,
    value: RegisterPayload[K]
  ) {
    resetRegisterState();
    setRegisterValue((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleRegisterSubmit() {
    const res = await submitRegister(registerValue);
    if (!res) return;

    setUsername(registerValue.email);
    setPassword('');
    setRegisterValue((prev) => ({
      ...prev,
      password: '',
    }));
  }

  useEffect(() => {
    if (!open) return;

    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };

    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open, handleClose]);

useEffect(() => {
  if (!open || !isAuthenticated) return;
  onClose();
}, [open, isAuthenticated, onClose]);
  if (!open) return null;

  return createPortal(
    <div className={s.overlay} onClick={handleClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        {view === 'login' && (
          <LoginForm
            username={username}
            password={password}
            onUsernameChange={setUsername}
            onPasswordChange={setPassword}
            onSubmit={onSubmit}
            loading={loading}
            error={error}
            onGoToForgot={() => handleGoToForgot(username)}
            onGoToRegister={handleGoToRegister}
          />
        )}

        {view === 'register' && (
          <RegisterForm
            value={registerValue}
            onChange={handleRegisterChange}
            onSubmit={handleRegisterSubmit}
            loading={registerLoading}
            error={registerError}
            success={registerSuccess}
            onBackToLogin={handleGoToLogin}
          />
        )}

        {view === 'forgot' && (
          <ForgotPasswordForm
            initialEmail={recoveryIdentifier || username}
            onBackToLogin={handleGoToLogin}
            onGoToOtp={handleGoToOtp}
          />
        )}

        {view === 'otp' && (
          <VerifyOtpForm
            initialUsernameOrEmail={recoveryIdentifier}
            onBackToForgot={() => handleGoToForgot(recoveryIdentifier)}
            onGoToReset={handleGoToReset}
          />
        )}

        {view === 'reset' && (
          <ResetPasswordForm
            initialEmail={recoveryIdentifier}
            initialOtp={verifiedOtp}
            onBackToLogin={handleGoToLogin}
            onSuccessToLogin={handleGoToLogin}
          />
        )}
      </div>
    </div>,
    document.body
  );
}