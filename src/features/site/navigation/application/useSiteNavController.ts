'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useAuth } from '@/features/auth/context/auth.context';
import { getLoginFlowParams } from '@/features/auth/utils/authQuery';
import { stripAuthModalQuery } from '@/features/auth/utils/authRedirect';

import { AUTH_NAV_ITEMS, SITE_NAV_ITEMS } from '../model/nav.constants';
import type { AuthModalState, OpenAuthModalDetail } from '../model/nav.types';

const INITIAL_AUTH_MODAL_STATE: AuthModalState = {
  open: false,
  source: 'nav',
  returnTo: null,
  appCode: null,
  initialView: 'login',
};

export function useSiteNavController() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<AuthModalState>(INITIAL_AUTH_MODAL_STATE);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { compact } = useCompactNav();
  const { isAuthenticated, logout, sesion, mode } = useAuth();

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const openAuthModal = useCallback((detail?: OpenAuthModalDetail) => {
    setAuthModal({
      open: true,
      source: detail?.source ?? 'nav',
      returnTo: detail?.returnTo ?? null,
      appCode: detail?.appCode ?? null,
      initialView: detail?.initialView ?? 'login',
    });
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModal(INITIAL_AUTH_MODAL_STATE);
  }, []);

  useOverlayLock(menuOpen, closeMenu);
  useAuthModalEvent({ onOpen: openAuthModal });

  const displayName = sesion?.username ?? 'Mi cuenta';
  const authQuery = useMemo(() => getLoginFlowParams(searchParams), [searchParams]);
  const navItems = useMemo(
    () => (isAuthenticated ? AUTH_NAV_ITEMS : SITE_NAV_ITEMS),
    [isAuthenticated]
  );
  const accountHref = mode === 'admin' ? '/admin' : '/';

  const handleOpenLogin = useCallback(() => {
    closeMenu();
    openAuthModal({
      source: 'nav',
      returnTo: null,
      appCode: null,
      initialView: 'login',
    });
  }, [closeMenu, openAuthModal]);

  const clearAuthQuery = useCallback(() => {
    const nextUrl = stripAuthModalQuery(pathname, new URLSearchParams(searchParams.toString()));
    router.replace(nextUrl, { scroll: false });
  }, [pathname, router, searchParams]);

  useEffect(() => {
    if (!authQuery.authView) {
      return undefined;
    }

    if (isAuthenticated) {
      clearAuthQuery();
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      openAuthModal({
        source: 'nav',
        returnTo: authQuery.returnTo,
        appCode: authQuery.appCodeFromQuery,
        initialView: authQuery.authView,
      });
    }, 0);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [authQuery, clearAuthQuery, isAuthenticated, openAuthModal]);

  const handleCloseAuthModal = useCallback(() => {
    closeAuthModal();
    if (authQuery.authView) {
      clearAuthQuery();
    }
  }, [authQuery.authView, clearAuthQuery, closeAuthModal]);

  return {
    menuOpen,
    compact,
    isAuthenticated,
    logout,
    displayName,
    navItems,
    accountHref,
    authModal,
    closeMenu,
    toggleMenu,
    handleOpenLogin,
    handleCloseAuthModal,
  };
}

function useCompactNav() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const TOP_OFFSET = 20;
    const SCROLL_THRESHOLD = 10;
    let lastY = window.scrollY || 0;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY || 0;
        const delta = currentY - lastY;

        if (currentY < TOP_OFFSET) {
          setCompact(false);
        } else if (delta > SCROLL_THRESHOLD) {
          setCompact(true);
        } else if (delta < -SCROLL_THRESHOLD) {
          setCompact(false);
        }

        lastY = currentY;
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return { compact };
}

function useOverlayLock(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = '';
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);
}

function useAuthModalEvent({
  onOpen,
}: {
  onOpen: (detail?: OpenAuthModalDetail) => void;
}) {
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
