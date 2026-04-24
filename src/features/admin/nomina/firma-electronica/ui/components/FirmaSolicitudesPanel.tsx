import { Plus } from 'lucide-react';

import type {
  SignatureRequestStatus,
  SolicitudFirmaListItemDto,
} from '@/features/admin/nomina/firma-electronica/model/firma-electronica.types';
import NominaEmptyState from '@/features/admin/nomina/shared/ui/NominaEmptyState/NominaEmptyState';

import FirmaSolicitudesTable from './FirmaSolicitudesTable';
import s from './FirmaSolicitudesPanel.module.css';

type Props = {
  status: SignatureRequestStatus | '';
  loading: boolean;
  items: SolicitudFirmaListItemDto[];
  error: string | null;
  selectedRequestId: string;
  onChangeStatus: (value: SignatureRequestStatus | '') => void;
  onOpenDetails: (requestId: string) => void;
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
  onOpenDetails,
  onViewSignedPdf,
  onDownloadSignedPdf,
  onOpenCreateModal,
}: Props) {
  const activeStatusLabel =
    STATUS_OPTIONS.find((option) => option.value === status)?.label ?? 'Todos';
  const resultLabel =
    items.length === 1 ? 'solicitud encontrada' : 'solicitudes encontradas';

  return (
    <section className={s.panel}>
      <header className={s.header}>
        <div className={s.topRow}>
          <div className={s.titleBlock}>
            <h2>Solicitudes registradas</h2>
            <p className={s.subtitle}>
              Consulta el estado de cada solicitud y accede al PDF firmado
              cuando este disponible.
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
            <div className={s.filtersHeading}>
              <span className={s.filtersLabel}>Estatus</span>
              <span className={s.filtersSummary}>
                {items.length} {resultLabel} en <strong>{activeStatusLabel}</strong>
              </span>
            </div>

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
                    aria-pressed={isActive}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? <span className={s.loadingText}>Actualizando...</span> : null}
        </div>
      </header>

      {error ? <p className={s.feedback}>{error}</p> : null}

      {!items.length ? (
        <div className={s.emptyWrap}>
          <NominaEmptyState
            title="Sin solicitudes registradas"
            description="No hay resultados para el filtro seleccionado. Ajusta el estatus o crea una nueva solicitud."
            variant="search"
          />
        </div>
      ) : (
        <FirmaSolicitudesTable
          items={items}
          selectedRequestId={selectedRequestId}
          onOpenDetails={onOpenDetails}
          onViewSignedPdf={onViewSignedPdf}
          onDownloadSignedPdf={onDownloadSignedPdf}
        />
      )}
    </section>
  );
}
