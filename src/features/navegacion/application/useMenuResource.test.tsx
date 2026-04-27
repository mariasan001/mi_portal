import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/lib/api/api.errors';

import { useMenuResource } from './useMenuResource';

vi.mock('../api/menu.queries', () => ({
  obtenerMenu: vi.fn(),
}));

import { obtenerMenu } from '../api/menu.queries';

const mockedObtenerMenu = vi.mocked(obtenerMenu);

describe('useMenuResource', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not load anything when appCode is empty', async () => {
    const { result } = renderHook(() => useMenuResource(null));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(mockedObtenerMenu).not.toHaveBeenCalled();
  });

  it('loads menu data on mount', async () => {
    mockedObtenerMenu.mockResolvedValueOnce({
      appCode: 'PLAT_SERV',
      items: [],
    });

    const { result } = renderHook(() => useMenuResource('PLAT_SERV'));

    await waitFor(() => {
      expect(result.current.data).toEqual({
        appCode: 'PLAT_SERV',
        items: [],
      });
    });

    expect(mockedObtenerMenu).toHaveBeenCalledWith('PLAT_SERV', { force: false });
    expect(result.current.error).toBeNull();
  });

  it('exposes a friendly error when the request fails', async () => {
    mockedObtenerMenu.mockRejectedValueOnce(
      new ApiError({ message: 'IAM fallo', status: 502 })
    );

    const { result } = renderHook(() => useMenuResource('PLAT_SERV'));

    await waitFor(() => {
      expect(result.current.error).toBe('IAM fallo');
    });

    expect(result.current.data).toBeNull();
  });

  it('refreshes with force=true by default', async () => {
    mockedObtenerMenu.mockResolvedValue({
      appCode: 'PLAT_SERV',
      items: [],
    });

    const { result } = renderHook(() => useMenuResource('PLAT_SERV'));

    await waitFor(() => {
      expect(result.current.data).not.toBeNull();
    });

    await act(async () => {
      await result.current.refresh();
    });

    expect(mockedObtenerMenu).toHaveBeenLastCalledWith('PLAT_SERV', { force: true });
  });
});
