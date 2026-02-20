// src/features/site/Components/QuickAccessSection/types/quickAccess.types.ts
import type { ReactNode } from 'react';

export type QuickAccessItem = {
  title: string;
  desc: string;
  href: string;
  icon: ReactNode;

  // ✅ nuevo: qué app es y si requiere login
  appCode?: string;          // ej: 'PLAT_SERV' | 'COMPROBANTES' | ...
  requiresAuth?: boolean;    // si true: gate de login
};