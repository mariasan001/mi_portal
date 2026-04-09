import { Plus } from 'lucide-react';
import type {
  SignatureRequestStatus,
  SolicitudFirmaListItemDto,
} from '../../../types/firma-electronica.types';
import EmptyFirmaState from './EmptyFirmaState';
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

const STATUS_OPTIONS: Array<{
  label: string;
  value: SignatureRequestStatus | '';
}> = [
  { label: 'Todos', value: '' },
  { label: 'Pendiente', value: 'PENDING' },
  { label: 'Procesando', value: 'PROCESSING' },
  { label: 'Firmado', value: 'SIGNED' },
  { label: 'Fallido', value: 'FAILED' },
];

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
        <div className={s.topRow}>
          <div className={s.titleBlock}>
            <h2>Solicitudes registradas</h2>
            <p className={s.subtitle}>
              Consulta el estado de cada solicitud y accede al PDF firmado
              cuando esté disponible.
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

        <div className={s.filtersRow}>
          <div className={s.filtersBlock}>
            <span className={s.filtersLabel}>Estatus</span>

            <div className={s.chips}>
              {STATUS_OPTIONS.map((option) => {
                const isActive = status === option.value;

                return (
                  <button
                    key={option.label}
                    type="button"
                    className={`${s.chip} ${isActive ? s.chipActive : ''}`}
                    onClick={() => onChangeStatus(option.value)}
                    disabled={loading}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? <span className={s.loadingText}>Actualizando…</span> : null}
        </div>
      </header>

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