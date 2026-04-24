import type { ReactNode } from 'react';

export type QuickAccessItem = {
  title: string;
  desc: string;
  href: string;
  icon: ReactNode;
  appCode?: string;
  requiresAuth?: boolean;
};
