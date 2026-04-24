import { redirect } from 'next/navigation';
import { APP_ROUTES } from '../_lib/routes';

export default function AdminPage() {
  redirect(APP_ROUTES.admin.nomina.configuracion);
}
