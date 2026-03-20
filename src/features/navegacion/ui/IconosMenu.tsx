'use client';

import { Circle, Home, Users, Workflow } from 'lucide-react';

const ICONS = {
  home: Home,
  users: Users,
  workflow: Workflow,
} as const;

export function IconoMenu({ icon }: { icon: string }) {
  const key = (icon ?? '').toLowerCase();
  const Comp = ICONS[key as keyof typeof ICONS] ?? Circle;
  return <Comp size={18} />;
}
