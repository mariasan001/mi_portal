
import { X } from 'lucide-react';

import type {
  FirmaDetalleTecnicoDto,
  SolicitudFirmaDetalleDto,
} from '../../../types/firma-electronica.types';
import { formatDateTime } from '../utils/firma-electronica-view.utils';
import FirmaDetalleTecnicoCard from './FirmaDetalleTecnicoCard';
import FirmaSolicitudDetalleCard from './FirmaSolicitudDetalleCard';
import s from './FirmaDetallesModal.module.css';

type Props = {
  isOpen: boolean;
  detalle: SolicitudFirmaDetalleDto | null;
  detalleTecnico: FirmaDetalleTecnicoDto | null;
  detalleLoading: boolean;
  detalleError: string | null;
  detalleTecnicoLoading: boolean;
  detalleTecnicoError: string | null;
  onClose: () => void;
};

function getStatusLabel(status?: string | null): string {
  switch (status?.trim().toUpperCase()) {
    case 'PENDING':
      return 'Pendiente';
    case 'PROCESSING':
      return 'Procesando';
    case 'SIGNED':
      return 'Firmado';
    case 'FAILED':
      return 'Fallido';
    default:
      return 'Sin estatus';
  }
}

export default function FirmaDetallesModal({
  isOpen,
  detalle,
  detalleTecnico,
  detalleLoading,
  detalleError,
  detalleTecnicoLoading,
  detalleTecnicoError,
  onClose,
}: Props) {
  if (!isOpen) {
    return null;
  }

  const title =
    detalle?.documentName?.trim() ||
    detalle?.originalFileName?.trim() ||
    'Detalle de solicitud';

  return (
    <div className={s.overlay} onClick={onClose}>
      <div
        className={s.modal}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="firma-detalles-title"
      >
        <div className={s.header}>
          <div className={s.headerText}>
            <span className={s.kicker}>Firma electronica</span>
            <h3 id="firma-detalles-title">{title}</h3>
            <p>
              Consulta en un solo lugar el detalle funcional y la evidencia
              tecnica de la solicitud seleccionada.
            </p>
          </div>

          <button
            type="button"
            className={s.iconCloseBtn}
            onClick={onClose}
            aria-label="Cerrar modal de detalles"
          >
            <X size={18} />
          </button>
        </div>

        <div className={s.body}>
          <section className={s.summary}>
            <div className={s.summaryMeta}>
              <div className={s.metaItem}>
                <span className={s.metaLabel}>Estatus</span>
                <span className={s.metaBadge}>
                  {getStatusLabel(detalle?.status)}
                </span>
              </div>

              <div className={s.metaItem}>
                <span className={s.metaLabel}>Solicitado</span>
                <span className={s.metaValue}>
                  {formatDateTime(detalle?.requestedAt ?? null)}
                </span>
              </div>

              <div className={s.metaItem}>
                <span className={s.metaLabel}>Proveedor</span>
                <span className={s.metaValue}>
                  {detalle?.providerSignatureId || 'No disponible'}
                </span>
              </div>
            </div>
          </section>

          <div className={s.content}>
            <section className={s.column}>
              <div className={s.columnBody}>
                <FirmaSolicitudDetalleCard
                  loading={detalleLoading}
                  error={detalleError}
                  data={detalle}
                />
              </div>
            </section>

            <section className={s.column}>
              <div className={s.columnBody}>
                <FirmaDetalleTecnicoCard
                  loading={detalleTecnicoLoading}
                  error={detalleTecnicoError}
                  data={detalleTecnico}
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
