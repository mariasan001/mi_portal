export function buildQueryString(
  params?: Record<string, string | number | undefined>
): string {
  const qs = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    qs.set(key, String(value));
  });

  const query = qs.toString();
  return query ? `?${query}` : '';
}

