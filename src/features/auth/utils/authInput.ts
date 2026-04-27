export function safeTrim(value: string | null | undefined): string {
  return (value ?? '').trim();
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeTrim(value));
}
