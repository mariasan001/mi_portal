import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useComprobantesAccessController } from './useComprobantesAccessController';

describe('useComprobantesAccessController', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('starts in menu mode', () => {
    const { result } = renderHook(() => useComprobantesAccessController());

    expect(result.current.selectedKey).toBeNull();
    expect(result.current.phase).toBe('idle');
    expect(result.current.heroView).toBe('menu');
  });

  it('transitions to expanded after selecting a view', () => {
    const { result } = renderHook(() => useComprobantesAccessController());

    act(() => {
      result.current.handleSelectView('cfdi');
    });

    expect(result.current.selectedKey).toBe('cfdi');
    expect(result.current.phase).toBe('collapsing');

    act(() => {
      vi.advanceTimersByTime(240);
    });

    expect(result.current.phase).toBe('expanded');
    expect(result.current.heroView).toBe('cfdi');
  });

  it('returns to menu mode after going back', () => {
    const { result } = renderHook(() => useComprobantesAccessController());

    act(() => {
      result.current.handleSelectView('constancia-quincenal');
    });

    act(() => {
      vi.advanceTimersByTime(240);
    });

    expect(result.current.phase).toBe('expanded');

    act(() => {
      result.current.handleBack();
    });

    expect(result.current.phase).toBe('collapsing');

    act(() => {
      vi.advanceTimersByTime(320);
    });

    expect(result.current.selectedKey).toBeNull();
    expect(result.current.phase).toBe('idle');
    expect(result.current.heroView).toBe('menu');
  });
});
