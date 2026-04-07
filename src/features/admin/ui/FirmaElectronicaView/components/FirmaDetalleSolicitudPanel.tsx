import type { SolicitudFirmaDetalleDto } from '../../../types/firma-electronica.types';
import { formatDateTime } from '../utils/firma-electronica-view.utils';

type Props = {
  requestId: string;
  loading: boolean;
  error: string | null;
  data: SolicitudFirmaDetalleDto | null;
  onChangeRequestId: (value: string) => void;
  onLoad: () => void;
};

export default function FirmaDetalleSolicitudPanel({
  requestId,
  loading,
  error,
  data,
  onChangeRequestId,
  onLoad,
}: Props) {
  return (
    <section>
      <h2>Detalle de solicitud</h2>
      <p>Consulta la información operativa de una solicitud específica.</p>

      <div>
        <label htmlFor="firma-request-id-detalle">Request ID</label>
        <input
          id="firma-request-id-detalle"
          type="text"
          value={requestId}
          onChange={(e) => onChangeRequestId(e.target.value)}
          placeholder="UUID de la solicitud"
        />

        <button type="button" onClick={onLoad} disabled={loading}>
          {loading ? 'Consultando...' : 'Consultar detalle'}
        </button>
      </div>

      {error ? <p>{error}</p> : null}

      {!data ? (
        <p>Aún no hay detalle consultado.</p>
      ) : (
        <dl>
          <div><dt>Request ID</dt><dd>{data.requestId}</dd></div>
          <div><dt>Archivo original</dt><dd>{data.originalFileName}</dd></div>
          <div><dt>Estatus</dt><dd>{data.status}</dd></div>
          <div><dt>CUTS</dt><dd>{data.cuts}</dd></div>
          <div><dt>Nombre documento</dt><dd>{data.documentName || '—'}</dd></div>
          <div><dt>Descripción</dt><dd>{data.documentDescription || '—'}</dd></div>
          <div><dt>Provider Signature ID</dt><dd>{data.providerSignatureId || '—'}</dd></div>
          <div><dt>Error Code</dt><dd>{data.errorCode || '—'}</dd></div>
          <div><dt>Error Message</dt><dd>{data.errorMessage || '—'}</dd></div>
          <div><dt>Requested At</dt><dd>{formatDateTime(data.requestedAt)}</dd></div>
          <div><dt>Started At</dt><dd>{formatDateTime(data.startedAt)}</dd></div>
          <div><dt>Completed At</dt><dd>{formatDateTime(data.completedAt)}</dd></div>
        </dl>
      )}
    </section>
  );
}