// src/app/(public)/layout.tsx
import SiteNav from '@/features/site/Components/Nav/SiteNav';
import type { ReactNode } from 'react';
import { gotham } from '@/styles/fonts';
import FooterSection from '@/features/site/Components/FooterSection/SiteFooter';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className={gotham.variable}>
      <SiteNav />
      <main>{children}</main>
      <FooterSection />
    </div>
  );
}
