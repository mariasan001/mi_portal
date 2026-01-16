import type { ComponentType } from 'react';

// ✅ Ejemplo con lucide-react (ajusta al paquete real que instalaste)
import { Home, Users, Workflow, CircleHelp } from 'lucide-react';

/**
 * Unificamos el tipo de iconos para usarlos igual en todo el sistema.
 * - size/strokeWidth/className se pasan desde el Sidebar.
 */
export type IconComponent = ComponentType<{
  size?: number;
  strokeWidth?: number;
  className?: string;
}>;

export const IconHome: IconComponent = Home;
export const IconUsers: IconComponent = Users;
export const IconWorkflow: IconComponent = Workflow;

/** Ícono para cuando el backend mande algo no mapeado */
export const IconFallback: IconComponent = CircleHelp;
