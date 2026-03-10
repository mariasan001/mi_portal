// src/app/usuario/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UsuarioHomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/usuario/comprobantes');
    router.refresh();
  }, [router]);

  return null;
}