import type { SolicitudFirmaDetalleDto } from '../../../types/firma-electronica.types';
import { formatDateTime } from '../utils/firma-electronica-view.utils';
import s from './FirmaSolicitudDetalleCard.module.css';

type Props = {
  loading: boolean;
  error: string | null;
  data: SolicitudFirmaDetalleDto | null;
};

export default function FirmaSolicitudDetalleCard({
  loading,
  error,
  data,
}: Props) {
  if (loading) {
    return (
      <section className={s.card}>
        <div className={s.header}>
          <div>
            <h3>Detalle de solicitud</h3>
            <p>Cargando informacion operativa de la solicitud.</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={s.card}>
        <div className={s.header}>
          <div>
            <h3>Detalle de solicitud</h3>
            <p>No fue posible cargar el detalle de la solicitud.</p>
          </div>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className={s.card}>
        <div className={s.header}>
          <div>
            <h3>Detalle de solicitud</h3>
            <p>Datos operativos, archivo, CUTS y tiempos de la solicitud.</p>
          </div>
        </div>

        <p className={s.empty}>Selecciona una solicitud para ver su detalle.</p>
      </section>
    );
  }

  return (
    <section className={s.card}>
      <div className={s.header}>
        <div>
          <h3>Detalle de solicitud</h3>
          <p>Datos operativos, archivo, CUTS y tiempos de la solicitud.</p>
        </div>
      </div>

      <div className={s.sections}>
        <section className={s.section}>
          <h4 className={s.sectionTitle}>Resumen</h4>

          <dl className={s.grid}>
            <div className={s.item}>
              <dt>Request ID</dt>
              <dd>{data.requestId}</dd>
            </div>

            <div className={s.item}>
              <dt>Archivo original</dt>
              <dd>{data.originalFileName}</dd>
            </div>

            <div className={s.item}>
              <dt>CUTS</dt>
              <dd>{data.cuts}</dd>
            </div>

            <div className={s.item}>
              <dt>Provider Signature ID</dt>
              <dd>{data.providerSignatureId || 'No disponible'}</dd>
            </div>

            <div className={s.item}>
              <dt>Nombre documento</dt>
              <dd>{data.documentName || 'No disponible'}</dd>
            </div>

            <div className={s.item}>
              <dt>Descripcion</dt>
              <dd>{data.documentDescription || 'No disponible'}</dd>
            </div>

            <div className={s.item}>
              <dt>Error code</dt>
              <dd>{data.errorCode || 'No disponible'}</dd>
            </div>

            <div className={s.item}>
              <dt>Error message</dt>
              <dd>{data.errorMessage || 'No disponible'}</dd>
            </div>

            <div className={s.item}>
              <dt>Solicitado</dt>
              <dd>{formatDateTime(data.requestedAt)}</dd>
            </div>

            <div className={s.item}>
              <dt>Iniciado</dt>
              <dd>{formatDateTime(data.startedAt)}</dd>
            </div>

            <div className={s.item}>
              <dt>Completado</dt>
              <dd>{formatDateTime(data.completedAt)}</dd>
            </div>
          </dl>
        </section>
      </div>
    </section>
  );
}
