import type { ReactNode } from 'react';
import './globals.css';
import { gotham } from '@/styles/fonts';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={gotham.variable}>
      <body>{children}</body>
    </html>
  );
}
