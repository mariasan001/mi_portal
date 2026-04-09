import { Plus } from 'lucide-react';
import type {
  SignatureRequestStatus,
  SolicitudFirmaListItemDto,
} from '../../../types/firma-electronica.types';
import EmptyFirmaState from './EmptyFirmaState';
import FirmaSolicitudesToolbar from './FirmaSolicitudesToolbar';
import FirmaSolicitudesTable from './FirmaSolicitudesTable';
import s from './FirmaSolicitudesPanel.module.css';

type Props = {
  status: SignatureRequestStatus | '';
  loading: boolean;
  items: SolicitudFirmaListItemDto[];
  error: string | null;
  selectedRequestId: string;
  onChangeStatus: (value: SignatureRequestStatus | '') => void;
  onSelectRequest: (requestId: string) => void;
  onViewSignedPdf: (requestId: string) => void;
  onDownloadSignedPdf: (requestId: string) => void;
  onOpenCreateModal: () => void;
};

export default function FirmaSolicitudesPanel({
  status,
  loading,
  items,
  error,
  selectedRequestId,
  onChangeStatus,
  onSelectRequest,
  onViewSignedPdf,
  onDownloadSignedPdf,
  onOpenCreateModal,
}: Props) {
  return (
    <section className={s.panel}>
      <header className={s.header}>
        <div className={s.headerRow}>
          <div className={s.titleBlock}>
            <h2>Solicitudes registradas</h2>
            <p className={s.subtitle}>
              Filtra por estatus y selecciona una solicitud para revisar su
              detalle o descargar el PDF firmado.
            </p>
          </div>

          <button
            type="button"
            className={s.primaryBtn}
            onClick={onOpenCreateModal}
          >
            <Plus size={16} />
            Nueva solicitud
          </button>
        </div>
      </header>

      <FirmaSolicitudesToolbar
        status={status}
        loading={loading}
        onChangeStatus={onChangeStatus}
      />

      {error ? <p className={s.feedback}>{error}</p> : null}

      {!items.length ? (
        <div className={s.emptyWrap}>
          <EmptyFirmaState
            title="Sin solicitudes registradas"
            description="No hay resultados para el filtro seleccionado. Ajusta el estatus o crea una nueva solicitud."
          />
        </div>
      ) : (
        <FirmaSolicitudesTable
          items={items}
          selectedRequestId={selectedRequestId}
          onSelectRequest={onSelectRequest}
          onViewSignedPdf={onViewSignedPdf}
          onDownloadSignedPdf={onDownloadSignedPdf}
        />
      )}
    </section>
  );
}