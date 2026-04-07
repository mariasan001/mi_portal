import type { SolicitudFirmaListItemDto } from '../../../types/firma-electronica.types';
import { formatDateTime } from '../utils/firma-electronica-view.utils';
import s from './FirmaSolicitudesTable.module.css';

type Props = {
  items: SolicitudFirmaListItemDto[];
  selectedRequestId: string;
  onSelectRequest: (requestId: string) => void;
};

function getStatusClass(status: string): string {
  switch (status) {
    case 'PENDING':
      return s.pending;
    case 'PROCESSING':
      return s.processing;
    case 'SIGNED':
      return s.signed;
    case 'FAILED':
      return s.failed;
    default:
      return s.defaultStatus;
  }
}

export default function FirmaSolicitudesTable({
  items,
  selectedRequestId,
  onSelectRequest,
}: Props) {
  return (
    <div className={s.tableWrap}>
      <table className={s.table}>
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Archivo</th>
            <th>Estatus</th>
            <th>Provider Signature ID</th>
            <th>Solicitado</th>
            <th>Completado</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => {
            const isActive = selectedRequestId === item.requestId;

            return (
              <tr
                key={item.requestId}
                className={isActive ? s.activeRow : ''}
                onClick={() => onSelectRequest(item.requestId)}
              >
                <td className={s.requestId}>{item.requestId}</td>
                <td>{item.originalFileName}</td>
                <td>
                  <span className={`${s.statusBadge} ${getStatusClass(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td>{item.providerSignatureId || '—'}</td>
                <td>{formatDateTime(item.requestedAt)}</td>
                <td>{formatDateTime(item.completedAt)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}