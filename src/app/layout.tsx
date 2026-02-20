import type { ReactNode } from 'react';
import './globals.css';
import { gotham } from '@/styles/fonts';

async function getUiConfig() {
  return { isVeda: true }; 
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { isVeda } = await getUiConfig();

  return (
    <html
      lang="es"
      className={gotham.variable}
      data-theme={isVeda ? 'veda' : undefined}
    >
      <body>{children}</body>
    </html>
  );
}