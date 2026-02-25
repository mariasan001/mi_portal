import type { ReactNode } from 'react';
import './globals.css';
import { gotham } from '@/styles/fonts';
import Providers from './providers';

async function getUiConfig() {
  return { isVeda: true };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { isVeda } = await getUiConfig();

  return (
    <html lang="es" className={gotham.variable} data-theme={isVeda ? 'veda' : undefined}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}