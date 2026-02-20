// src/features/site/Components/AppDownloadSection/utils.ts
export function isExternalHref(href?: string) {
  return !!href && /^https?:\/\//i.test(href);
}