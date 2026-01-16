import type { ReactNode } from 'react';
import React from 'react';

// ✅ Cambia este import al paquete real que instalaste
import { Home, Users, Workflow, CircleHelp } from 'lucide-react';
import type { LucideIcon, LucideProps } from 'lucide-react';

/**
 * Mapa ESTABLE (fuera del render).
 * OJO: aquí guardamos la REFERENCIA del componente, no wrappers.
 */
const ICONOS: Record<string, LucideIcon> = {
  home: Home,
  users: Users,
  workflow: Workflow,
};

function norm(v: string) {
  return v.trim().toLowerCase();
}

/**
 * Devuelve un ELEMENTO (ReactNode), no un componente.
 * Esto evita: "Cannot create components during render"
 */
export function renderIcon(name: string, props?: LucideProps): ReactNode {
  const Comp = ICONOS[norm(name)] ?? CircleHelp;
  return React.createElement(Comp, props);
}
