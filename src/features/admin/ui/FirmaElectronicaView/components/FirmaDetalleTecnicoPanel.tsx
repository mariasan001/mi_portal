import type { FirmaDetalleTecnicoDto } from '../../../types/firma-electronica.types';
import { formatUnknown } from '../utils/firma-electronica-view.utils';

type Props = {
  // Request ID que se desea consultar
  requestId: string;

  // Estado de carga de la consulta del detalle técnico
  loading: boolean;

  // Error de la consulta, si existe
  error: string | null;

  // Resultado técnico devuelto por la API
  data: FirmaDetalleTecnicoDto | null;

  // Actualiza el requestId en la vista
  onChangeRequestId: (value: string) => void;

  // Ejecuta la consulta del detalle técnico
  onLoad: () => void;
};

export default function FirmaDetalleTecnicoPanel({
  requestId,
  loading,
  error,
  data,
  onChangeRequestId,
  onLoad,
}: Props) {
  return (
    <section>
      {/* Encabezado del bloque */}
      <header>
        <h2>Detalle técnico de la firma</h2>
        <p>
          Consulta la evidencia técnica del documento firmado para una solicitud
          específica.
        </p>
      </header>

      {/* Barra de consulta */}
      <div>
        <label htmlFor="firma-request-id-tecnico">Request ID</label>

        <input
          id="firma-request-id-tecnico"
          type="text"
          value={requestId}
          onChange={(e) => onChangeRequestId(e.target.value)}
          placeholder="UUID de la solicitud"
        />

        <button type="button" onClick={onLoad} disabled={loading}>
          {loading ? 'Consultando...' : 'Consultar detalle técnico'}
        </button>
      </div>

      {/* Mensaje de error */}
      {error ? <p>{error}</p> : null}

      {/* Estado vacío */}
      {!data ? (
        <p>Aún no hay detalle técnico consultado.</p>
      ) : (
        <>
          {/* Datos principales del certificado/firma */}
          <dl>
            <div>
              <dt>Identificador de firma</dt>
              <dd>{data.identificadorFirma}</dd>
            </div>

            <div>
              <dt>Nombre del archivo</dt>
              <dd>{data.archivo.nombreArchivo}</dd>
            </div>

            <div>
              <dt>Mime Type</dt>
              <dd>{data.archivo.mimeType}</dd>
            </div>

            <div>
              <dt>Firmante</dt>
              <dd>{data.firmante.nombre}</dd>
            </div>

            <div>
              <dt>Correo</dt>
              <dd>{data.firmante.correo}</dd>
            </div>

            <div>
              <dt>Organización</dt>
              <dd>{data.firmante.organizacion}</dd>
            </div>

            <div>
              <dt>Serie de certificado</dt>
              <dd>{data.firmante.serieCertificado}</dd>
            </div>

            <div>
              <dt>Vigencia inicio</dt>
              <dd>{data.firmante.vigenciaInicio}</dd>
            </div>

            <div>
              <dt>Vigencia fin</dt>
              <dd>{data.firmante.vigenciaFin}</dd>
            </div>
          </dl>

          {/* Bloque del archivo firmado */}
          <section>
            <h3>Archivo firmado en base64</h3>
            <pre>{data.archivo.contenidoBase64}</pre>
          </section>

          {/* Bloque abierto para estructura no totalmente visible en Swagger */}
          <section>
            <h3>Autoridad certificadora</h3>
            <pre>{formatUnknown(data.autoridadCertificadora)}</pre>
          </section>
        </>
      )}
    </section>
  );
}