import './globals.css';
import { AuthProvider } from '@/features/autenticacion/context/autenticacion.context';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
