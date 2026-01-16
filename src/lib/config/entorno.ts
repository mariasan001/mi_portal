/**
 * Variables de entorno (SERVER).
 * No se importan en componentes client.
 */

export function obtenerIamBaseUrl(): string {
  const v = process.env.IAM_BASE_URL?.trim();

  if (!v) {
    throw new Error('Falta IAM_BASE_URL en .env.local (ej: http://localhost:8081/iam)');
  }

  return v.replace(/\/+$/, '');
}
