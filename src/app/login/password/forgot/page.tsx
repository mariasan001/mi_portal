'use client';

import Link from 'next/link';

import AuthSplitLayout from '@/features/auth/ui/AuthSplitLayout/AuthSplitLayout';
import ForgotPasswordForm from '@/features/auth/ui/ForgotPasswordForm/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <AuthSplitLayout
      leftTitle="Recupera tu acceso."
      leftDescription="Te enviaremos un OTP al correo para validar tu identidad y restablecer tu contraseña."
      bottomLeft={
        <>
          ¿Ya la recordaste? <Link href="/login">Inicia sesión</Link>
        </>
      }
      bottomRight={<Link href="/privacidad">Aviso de privacidad</Link>}
    >
      <ForgotPasswordForm otpHref="/login/password/otp" loginHref="/login" />
    </AuthSplitLayout>
  );
}