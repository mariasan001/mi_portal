'use client';

import { useEffect } from 'react';
import type { OpenAuthModalDetail } from '../types/nav.types';

type Params = {
  onOpen: (detail?: OpenAuthModalDetail) => void;
};

export function useAuthModalEvent({ onOpen }: Params) {
  useEffect(() => {
    const handleOpenAuthModal = (event: Event) => {
      const customEvent = event as CustomEvent<OpenAuthModalDetail>;
      onOpen(customEvent.detail);
    };

    window.addEventListener(
      'portal:open-auth-modal',
      handleOpenAuthModal as EventListener
    );

    return () => {
      window.removeEventListener(
        'portal:open-auth-modal',
        handleOpenAuthModal as EventListener
      );
    };
  }, [onOpen]);
}