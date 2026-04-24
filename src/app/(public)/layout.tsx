// src/app/(public)/layout.tsx
import type { ReactNode } from 'react';

import { SiteFooter, SiteNav } from '@/features/site';
import { gotham } from '@/styles/fonts';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className={gotham.variable}>
      <SiteNav />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
