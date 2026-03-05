'use client';

import { Toaster } from 'sonner';
import { AuthProvider } from '@/features/auth/context/auth.context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}

     <Toaster
  position="top-center"
  richColors
  closeButton
  expand
  toastOptions={{
    style: {
      borderRadius: '16px',
      fontWeight: 600,
      fontSize: '14px',
    },
  }}
/>
    </AuthProvider>
  );
}