'use client';

import type { ReactNode } from 'react';
import { AuthProvider } from '@/features/autenticacion/context/autenticacion.context';

export default function Providers({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}