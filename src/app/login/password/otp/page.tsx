'use client';

import { AuthSplitLayout, VerifyOtpForm } from '@/features/auth';
import Link from 'next/link';


export default function VerifyOtpPage() {
  return (
    <AuthSplitLayout
      leftTitle="Valida tu identidad."
      leftDescription="Confirma el OTP recibido para poder restablecer tu contraseña."
      bottomLeft={
        <>
          ¿Ya la recordaste? <Link href="/login">Inicia sesión</Link>
        </>
      }
      bottomRight={<Link href="/privacidad">Aviso de privacidad</Link>}
    >
      <VerifyOtpForm />
    </AuthSplitLayout>
  );
}