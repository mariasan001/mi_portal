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
    return <section className={s.card}>Cargando detalle...</section>;
  }

  if (error) {
    return <section className={s.card}>{error}</section>;
  }

  if (!data) {
    return (
      <section className={s.card}>
        <h3>Detalle de solicitud</h3>
        <p className={s.empty}>Selecciona una solicitud para ver su detalle.</p>
      </section>
    );
  }

  return (
    <section className={s.card}>
      <div className={s.header}>
        <h3>Detalle de solicitud</h3>
        <span className={s.status}>{data.status}</span>
      </div>

      <dl className={s.grid}>
        <div className={s.item}><dt>Request ID</dt><dd>{data.requestId}</dd></div>
        <div className={s.item}><dt>Archivo original</dt><dd>{data.originalFileName}</dd></div>
        <div className={s.item}><dt>CUTS</dt><dd>{data.cuts}</dd></div>
        <div className={s.item}><dt>Provider Signature ID</dt><dd>{data.providerSignatureId || '—'}</dd></div>
        <div className={s.item}><dt>Nombre documento</dt><dd>{data.documentName || '—'}</dd></div>
        <div className={s.item}><dt>Descripción</dt><dd>{data.documentDescription || '—'}</dd></div>
        <div className={s.item}><dt>Error Code</dt><dd>{data.errorCode || '—'}</dd></div>
        <div className={s.item}><dt>Error Message</dt><dd>{data.errorMessage || '—'}</dd></div>
        <div className={s.item}><dt>Solicitado</dt><dd>{formatDateTime(data.requestedAt)}</dd></div>
        <div className={s.item}><dt>Iniciado</dt><dd>{formatDateTime(data.startedAt)}</dd></div>
        <div className={s.item}><dt>Completado</dt><dd>{formatDateTime(data.completedAt)}</dd></div>
      </dl>
    </section>
  );
}