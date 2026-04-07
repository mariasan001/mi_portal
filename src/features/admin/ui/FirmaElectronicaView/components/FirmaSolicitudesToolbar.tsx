import s from './FirmaSolicitudesToolbar.module.css';
import type { SignatureRequestStatus } from '../../../types/firma-electronica.types';

type Props = {
  status: SignatureRequestStatus | '';
  loading: boolean;
  onChangeStatus: (value: SignatureRequestStatus | '') => void;
  onLoad: () => void;
};

export default function FirmaSolicitudesToolbar({
  status,
  loading,
  onChangeStatus,
  onLoad,
}: Props) {
  return (
    <div className={s.toolbar}>
      <div className={s.filterGroup}>
        <label htmlFor="firma-status-filter" className={s.label}>
          Filtrar por estatus
        </label>

        <select
          id="firma-status-filter"
          className={s.select}
          value={status}
          onChange={(e) =>
            onChangeStatus((e.target.value as SignatureRequestStatus | '') ?? '')
          }
        >
          <option value="">Todos</option>
          <option value="PENDING">PENDING</option>
          <option value="PROCESSING">PROCESSING</option>
          <option value="SIGNED">SIGNED</option>
          <option value="FAILED">FAILED</option>
        </select>
      </div>

      <button
        type="button"
        className={s.refreshBtn}
        onClick={onLoad}
        disabled={loading}
      >
        {loading ? 'Consultando...' : 'Actualizar listado'}
      </button>
    </div>
  );
}