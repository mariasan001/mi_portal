export function isExternalHref(href?: string) {
  return !!href && /^https?:\/\//i.test(href);
}
