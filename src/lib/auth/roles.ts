const ADMIN_ROLES = [
  'ROLE_ADMIN',
  'ROLE_SP_ADMIN',
  'ROLE_ADMIN_PLAT_SERV',
] as const;

export function isAdminRole(roles: readonly string[]): boolean {
  return ADMIN_ROLES.some((role) => roles.includes(role));
}

export function normalizeRoles(roles: unknown): string[] {
  if (!Array.isArray(roles)) {
    return [];
  }

  return roles.filter((role): role is string => typeof role === 'string' && role.length > 0);
}
