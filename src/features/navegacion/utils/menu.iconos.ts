import React from 'react';
import type { ReactNode } from 'react';

// ✅ ejemplo con lucide-react (ajústalo si tu paquete es otro)
import { Home, Users, Workflow, CircleHelp } from 'lucide-react';
import type { LucideIcon, LucideProps } from 'lucide-react';

const ICONOS: Record<string, LucideIcon> = {
  home: Home,
  users: Users,
  workflow: Workflow,
};

function norm(v: string) {
  return v.trim().toLowerCase();
}

/**
 * Devuelve un ReactNode (elemento ya creado).
 * Así el ESLint no puede acusar “component created during render”.
 */
export function renderIcon(name: string | null | undefined, props?: LucideProps): ReactNode {
  const key = norm(name ?? '');
  const Comp = ICONOS[key] ?? CircleHelp;
  return React.createElement(Comp, props);
}
