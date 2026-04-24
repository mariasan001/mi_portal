import type { SignatureRequestStatus } from '@/features/admin/nomina/firma-electronica/model/firma-electronica.types';
import s from './FirmaSolicitudesToolbar.module.css';

type Props = {
  status: SignatureRequestStatus | '';
  loading: boolean;
  onChangeStatus: (value: SignatureRequestStatus | '') => void;
};

export default function FirmaSolicitudesToolbar({
  status,
  loading,
  onChangeStatus,
}: Props) {
  return (
    <div className={s.toolbar}>
      <div className={s.filterGroup}>
        <label htmlFor="firma-status" className={s.label}>
          Filtrar por estatus
        </label>

        <select
          id="firma-status"
          className={s.select}
          value={status}
          onChange={(event) =>
            onChangeStatus(event.target.value as SignatureRequestStatus | '')
          }
          disabled={loading}
        >
          <option value="">Todos</option>
          <option value="PENDING">Pendiente</option>
          <option value="PROCESSING">Procesando</option>
          <option value="SIGNED">Firmado</option>
          <option value="FAILED">Con error</option>
        </select>
      </div>

      <div className={s.meta}>
        {loading ? <span className={s.loading}>Actualizando…</span> : null}
      </div>
    </div>
  );
}
