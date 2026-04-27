import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAssistantHint } from './useAssistantHint';

describe('useAssistantHint', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('sets a hint and scrolls when assistant requests tramite', () => {
    const scrollIntoView = vi.fn();
    vi.spyOn(document, 'getElementById').mockReturnValue({
      scrollIntoView,
    } as unknown as HTMLElement);

    const { result } = renderHook(() => useAssistantHint());

    act(() => {
      window.dispatchEvent(
        new CustomEvent('portal-assistant:navigate', {
          detail: { action: 'tramite' },
        })
      );
    });

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
    expect(result.current.assistantHint).toBe(
      'Aqui podras realizar tramites relacionados con lo que buscas.'
    );

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.assistantHint).toBe('');
  });

  it('ignores unsupported assistant actions', () => {
    const { result } = renderHook(() => useAssistantHint());

    act(() => {
      window.dispatchEvent(
        new CustomEvent('portal-assistant:navigate', {
          detail: { action: 'password' },
        })
      );
    });

    expect(result.current.assistantHint).toBe('');
  });
});
