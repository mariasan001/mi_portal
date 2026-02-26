'use client';

import { AuthSplitLayout, ResetPasswordForm } from '@/features/auth';
import Link from 'next/link';


export default function ResetPasswordPage() {
  return (
    <AuthSplitLayout
      leftTitle="Restablece tu contraseña."
      leftDescription="Ingresa el OTP que recibiste y define una nueva contraseña para recuperar el acceso."
      bottomLeft={
        <>
          ¿Ya la recordaste? <Link href="/login">Inicia sesión</Link>
        </>
      }
      bottomRight={<Link href="/privacidad">Aviso de privacidad</Link>}
    >
      <ResetPasswordForm loginHref="/login" />
    </AuthSplitLayout>
  );
}