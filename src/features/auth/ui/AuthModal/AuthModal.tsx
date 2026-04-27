'use client';

import { createPortal } from 'react-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/features/auth/context/auth.context';
import { useLoginFlow } from '@/features/auth/application/useLoginFlow';
import { useRegister } from '@/features/auth/application/useRegister';
import type { RegisterPayload } from '@/features/auth/model/register.types';

import ForgotPasswordForm from '../ForgotPasswordForm/ForgotPasswordForm';
import LoginForm from '../LoginForm/LoginForm';
import RegisterForm from '../RegisterForm/RegisterForm';
import ResetPasswordForm from '../ResetPasswordForm/ResetPasswordForm';
import VerifyOtpForm from '../VerifyOtpForm/VerifyOtpForm';
import s from './AuthModal.module.css';

export type AuthModalSource = 'nav' | 'quick-access';
export type AuthView = 'login' | 'register' | 'forgot' | 'otp' | 'reset';

type Props = {
  open: boolean;
  onClose: () => void;
  source?: AuthModalSource;
  returnTo?: string | null;
  appCode?: string | null;
  initialView?: AuthView;
};

const INITIAL_REGISTER_VALUE: RegisterPayload = {
  claveSp: '',
  plaza: '',
  puesto: '',
  email: '',
  password: '',
  phone: '',
};

export default function AuthModal({
  open,
  onClose,
  source = 'nav',
  returnTo = null,
  appCode = null,
  initialView = 'login',
}: Props) {
  const [view, setView] = useState<AuthView>(initialView);
  const [recoveryIdentifier, setRecoveryIdentifier] = useState('');
  const [verifiedOtp, setVerifiedOtp] = useState('');
  const [registerValue, setRegisterValue] = useState<RegisterPayload>(
    INITIAL_REGISTER_VALUE
  );

  const {
    username,
    setUsername,
    password,
    setPassword,
    onSubmit,
    loading,
    error,
    reset: resetLoginFlow,
  } = useLoginFlow({
    source,
    returnTo,
    appCode,
  });

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
    return registerData.message ?? 'Registro exitoso. Ya puedes iniciar sesion.';
  }, [registerData]);

  const resetFlowState = useCallback(() => {
    setView(initialView);
    setRecoveryIdentifier('');
    setVerifiedOtp('');
    setRegisterValue(INITIAL_REGISTER_VALUE);
    resetRegisterState();
    resetLoginFlow();
  }, [initialView, resetLoginFlow, resetRegisterState]);

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
    const result = await submitRegister(registerValue);
    if (!result) return;

    setUsername(registerValue.email);
    setPassword('');
    setRegisterValue((prev) => ({
      ...prev,
      password: '',
    }));
    setView('login');
  }

  useEffect(() => {
    if (!open) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [open, handleClose]);

  useEffect(() => {
    if (!open || !isAuthenticated) return;
    onClose();
  }, [open, isAuthenticated, onClose]);

  if (!open) return null;

  return createPortal(
    <div className={s.overlay} onClick={handleClose}>
      <div className={s.modal} onClick={(event) => event.stopPropagation()}>
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
