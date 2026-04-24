import { redirect } from 'next/navigation';
import { APP_ROUTES } from '../_lib/routes';

export default function UsuarioHomePage() {
  redirect(APP_ROUTES.usuario.comprobantes);
}
