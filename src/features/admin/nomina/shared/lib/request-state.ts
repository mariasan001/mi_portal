export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function idleState<T>(data: T | null = null): AsyncState<T> {
  return {
    data,
    loading: false,
    error: null,
  };
}

export function loadingState<T>(currentData: T | null = null): AsyncState<T> {
  return {
    data: currentData,
    loading: true,
    error: null,
  };
}

export function successState<T>(data: T): AsyncState<T> {
  return {
    data,
    loading: false,
    error: null,
  };
}

export function errorState<T>(
  message: string,
  currentData: T | null = null
): AsyncState<T> {
  return {
    data: currentData,
    loading: false,
    error: message,
  };
}
