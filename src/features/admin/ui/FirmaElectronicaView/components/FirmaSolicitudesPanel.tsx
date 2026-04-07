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
  onLoad: () => void;
  onSelectRequest: (requestId: string) => void;
};

export default function FirmaSolicitudesPanel({
  status,
  loading,
  items,
  error,
  selectedRequestId,
  onChangeStatus,
  onLoad,
  onSelectRequest,
}: Props) {
  return (
    <section className={s.panel}>
      <header className={s.header}>
        <h2>Solicitudes registradas</h2>

        <p className={s.subtitle}>
          Da clic en una fila para consultar el detalle operativo y la evidencia
          técnica de la firma.
        </p>
      </header>

      <FirmaSolicitudesToolbar
        status={status}
        loading={loading}
        onChangeStatus={onChangeStatus}
        onLoad={onLoad}
      />

      {error ? <p className={s.feedback}>{error}</p> : null}

      {/* 
        El empty state solo vive aquí adentro.
        Ya no existe duplicado en otro panel lateral.
      */}
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
        />
      )}
    </section>
  );
}