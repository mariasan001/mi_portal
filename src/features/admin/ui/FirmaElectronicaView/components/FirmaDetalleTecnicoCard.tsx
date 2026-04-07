import type { FirmaDetalleTecnicoDto } from '../../../types/firma-electronica.types';
import { formatUnknown } from '../utils/firma-electronica-view.utils';
import s from './FirmaDetalleTecnicoCard.module.css';

type Props = {
  loading: boolean;
  error: string | null;
  data: FirmaDetalleTecnicoDto | null;
};

export default function FirmaDetalleTecnicoCard({
  loading,
  error,
  data,
}: Props) {
  if (loading) {
    return <section className={s.card}>Cargando detalle técnico...</section>;
  }

  if (error) {
    return <section className={s.card}>{error}</section>;
  }

  if (!data) {
    return (
      <section className={s.card}>
        <h3>Detalle técnico</h3>
        <p className={s.empty}>
          Selecciona una solicitud para revisar la evidencia técnica.
        </p>
      </section>
    );
  }

  return (
    <section className={s.card}>
      <div className={s.header}>
        <h3>Detalle técnico de la firma</h3>
      </div>

      <dl className={s.grid}>
        <div className={s.item}><dt>Identificador de firma</dt><dd>{data.identificadorFirma}</dd></div>
        <div className={s.item}><dt>Nombre archivo</dt><dd>{data.archivo.nombreArchivo}</dd></div>
        <div className={s.item}><dt>Mime Type</dt><dd>{data.archivo.mimeType}</dd></div>
        <div className={s.item}><dt>Firmante</dt><dd>{data.firmante.nombre}</dd></div>
        <div className={s.item}><dt>Correo</dt><dd>{data.firmante.correo}</dd></div>
        <div className={s.item}><dt>Organización</dt><dd>{data.firmante.organizacion}</dd></div>
        <div className={s.item}><dt>Serie certificado</dt><dd>{data.firmante.serieCertificado}</dd></div>
        <div className={s.item}><dt>Vigencia inicio</dt><dd>{data.firmante.vigenciaInicio}</dd></div>
        <div className={s.item}><dt>Vigencia fin</dt><dd>{data.firmante.vigenciaFin}</dd></div>
      </dl>

      <div className={s.block}>
        <h4>Autoridad certificadora</h4>
        <pre>{formatUnknown(data.autoridadCertificadora)}</pre>
      </div>

      <div className={s.block}>
        <h4>Contenido firmado en base64</h4>
        <pre>{data.archivo.contenidoBase64}</pre>
      </div>
    </section>
  );
}