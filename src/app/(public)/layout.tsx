// src/app/(public)/layout.tsx
import SiteFooter from '@/features/site/Components/SiteFooter';
import SiteNav from '@/features/site/Components/Nav/SiteNav';
import type { ReactNode } from 'react';
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
