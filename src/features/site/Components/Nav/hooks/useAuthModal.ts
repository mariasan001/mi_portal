'use client';

import { useCallback, useState } from 'react';
import type {
  AuthModalState,
  OpenAuthModalDetail,
} from '../types/nav.types';

const INITIAL_AUTH_MODAL_STATE: AuthModalState = {
  open: false,
  source: 'nav',
  returnTo: null,
  appCode: null,
  initialView: 'login',
};

export function useAuthModal() {
  const [state, setState] = useState<AuthModalState>(INITIAL_AUTH_MODAL_STATE);

  const openAuthModal = useCallback((detail?: OpenAuthModalDetail) => {
    setState({
      open: true,
      source: detail?.source ?? 'nav',
      returnTo: detail?.returnTo ?? null,
      appCode: detail?.appCode ?? null,
      initialView: detail?.initialView ?? 'login',
    });
  }, []);

  const closeAuthModal = useCallback(() => {
    setState(INITIAL_AUTH_MODAL_STATE);
  }, []);

  return {
    authModal: state,
    openAuthModal,
    closeAuthModal,
  };
}