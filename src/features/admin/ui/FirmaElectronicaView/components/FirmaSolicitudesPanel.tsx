import type {
  SignatureRequestStatus,
  SolicitudFirmaListItemDto,
} from '../../../types/firma-electronica.types';
import { formatDateTime } from '../utils/firma-electronica-view.utils';

type Props = {
  // Estatus actualmente seleccionado en el filtro
  status: SignatureRequestStatus | '';

  // Estado de carga de la consulta del listado
  loading: boolean;

  // Elementos devueltos por la API
  items: SolicitudFirmaListItemDto[];

  // Error de la consulta, si existe
  error: string | null;

  // Cambia el filtro de estatus
  onChangeStatus: (value: SignatureRequestStatus | '') => void;

  // Ejecuta la consulta del listado
  onLoad: () => void;

  // Permite seleccionar un requestId desde la tabla
  onSelectRequest: (requestId: string) => void;
};

export default function FirmaSolicitudesPanel({
  status,
  loading,
  items,
  error,
  onChangeStatus,
  onLoad,
  onSelectRequest,
}: Props) {
  return (
    <section>
      {/* Encabezado del bloque */}
      <header>
        <h2>Listado de solicitudes</h2>
        <p>Consulta solicitudes registradas y filtra por estatus.</p>
      </header>

      {/* Barra de filtros */}
      <div>
        <label htmlFor="firma-status-filter">Estatus</label>

        <select
          id="firma-status-filter"
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

        <button type="button" onClick={onLoad} disabled={loading}>
          {loading ? 'Consultando...' : 'Consultar listado'}
        </button>
      </div>

      {/* Mensaje de error */}
      {error ? <p>{error}</p> : null}

      {/* Estado vacío */}
      {!items.length ? (
        <p>No hay solicitudes para mostrar.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Archivo</th>
              <th>Estatus</th>
              <th>Provider Signature ID</th>
              <th>Solicitado</th>
              <th>Completado</th>
              <th>Acción</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.requestId}>
                <td>{item.requestId}</td>
                <td>{item.originalFileName}</td>
                <td>{item.status}</td>
                <td>{item.providerSignatureId}</td>
                <td>{formatDateTime(item.requestedAt)}</td>
                <td>{formatDateTime(item.completedAt)}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => onSelectRequest(item.requestId)}
                  >
                    Usar requestId
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}