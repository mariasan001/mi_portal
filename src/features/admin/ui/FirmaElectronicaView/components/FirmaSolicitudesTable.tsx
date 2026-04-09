import type { SolicitudFirmaListItemDto } from '../../../types/firma-electronica.types';
import { formatDateTime } from '../utils/firma-electronica-view.utils';
import s from './FirmaSolicitudesTable.module.css';

type Props = {
  items: SolicitudFirmaListItemDto[];
  selectedRequestId: string;
  onSelectRequest: (requestId: string) => void;
  onViewSignedPdf: (requestId: string) => void;
  onDownloadSignedPdf: (requestId: string) => void;
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
  onViewSignedPdf,
  onDownloadSignedPdf,
}: Props) {
  return (
    <div className={s.tableWrap}>
      <table className={s.table}>
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Archivo</th>
            <th>Estatus</th>
            <th>Proveedor</th>
            <th>Solicitado</th>
            <th>Completado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => {
            const isActive = selectedRequestId === item.requestId;
            const normalizedStatus = item.status?.trim().toUpperCase() ?? '';
            const isSigned = normalizedStatus === 'SIGNED';

            return (
              <tr
                key={item.requestId}
                className={isActive ? s.activeRow : ''}
                onClick={() => onSelectRequest(item.requestId)}
              >
                <td className={s.requestIdCell}>
                  <span className={s.requestId} title={item.requestId}>
                    {item.requestId}
                  </span>
                </td>

                <td>
                  <span className={s.fileName} title={item.originalFileName}>
                    {item.originalFileName}
                  </span>
                </td>

                <td>
                  <span
                    className={`${s.statusBadge} ${getStatusClass(normalizedStatus)}`}
                  >
                    {item.status}
                  </span>
                </td>

                <td>
                  <span
                    className={s.providerId}
                    title={item.providerSignatureId || '—'}
                  >
                    {item.providerSignatureId || '—'}
                  </span>
                </td>

                <td className={s.dateCell}>
                  {formatDateTime(item.requestedAt)}
                </td>

                <td className={s.dateCell}>
                  {formatDateTime(item.completedAt)}
                </td>

                <td>
                  {isSigned ? (
                    <div
                      className={s.actions}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <button
                        type="button"
                        className={s.secondaryButton}
                        onClick={() => onViewSignedPdf(item.requestId)}
                      >
                        Ver PDF
                      </button>

                      <button
                        type="button"
                        className={s.primaryButton}
                        onClick={() => onDownloadSignedPdf(item.requestId)}
                      >
                        Descargar
                      </button>
                    </div>
                  ) : (
                    <span className={s.noActions}>—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}