// src/features/site/Components/ConvocatoriasSection/utils/convocatoriasUtils.ts

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

export function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function placeholderDataUri() {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720">
    <rect width="1200" height="720" fill="#ffffff"/>
    <rect x="18" y="18" width="1164" height="684" rx="18" ry="18" fill="#ffffff" stroke="#e5e7eb" stroke-width="6"/>
    <g fill="#d1d5db">
      <path d="M420 460 L520 340 Q540 320 560 340 L650 450 Q670 470 650 490 L440 490 Q410 490 420 460Z" opacity="0.95"/>
      <circle cx="720" cy="330" r="44" opacity="0.95"/>
    </g>
  </svg>`.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}