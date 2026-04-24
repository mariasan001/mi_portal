'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type {
  ComprobanteAccessKey,
  ComprobantesHeroView,
  ComprobantesTransitionPhase,
} from '../model/comprobantes.types';

const COLLAPSE_DURATION_MS = 240;
const RETURN_DURATION_MS = 320;

type UseComprobantesAccessControllerReturn = {
  selectedKey: ComprobanteAccessKey | null;
  phase: ComprobantesTransitionPhase;
  heroView: ComprobantesHeroView;
  handleSelectView: (key: ComprobanteAccessKey) => void;
  handleBack: () => void;
};

export function useComprobantesAccessController(): UseComprobantesAccessControllerReturn {
  const [selectedKey, setSelectedKey] = useState<ComprobanteAccessKey | null>(null);
  const [phase, setPhase] = useState<ComprobantesTransitionPhase>('idle');

  const selectTimerRef = useRef<number | null>(null);
  const backTimerRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (selectTimerRef.current !== null) {
      window.clearTimeout(selectTimerRef.current);
      selectTimerRef.current = null;
    }

    if (backTimerRef.current !== null) {
      window.clearTimeout(backTimerRef.current);
      backTimerRef.current = null;
    }
  }, []);

  const handleSelectView = useCallback(
    (key: ComprobanteAccessKey) => {
      if (phase !== 'idle') return;

      clearTimers();
      setSelectedKey(key);
      setPhase('collapsing');

      selectTimerRef.current = window.setTimeout(() => {
        setPhase('expanded');
        selectTimerRef.current = null;
      }, COLLAPSE_DURATION_MS);
    },
    [clearTimers, phase]
  );

  const handleBack = useCallback(() => {
    if (!selectedKey) return;

    clearTimers();
    setPhase('collapsing');

    backTimerRef.current = window.setTimeout(() => {
      setSelectedKey(null);
      setPhase('idle');
      backTimerRef.current = null;
    }, RETURN_DURATION_MS);
  }, [clearTimers, selectedKey]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  return {
    selectedKey,
    phase,
    heroView: selectedKey ?? 'menu',
    handleSelectView,
    handleBack,
  };
}
