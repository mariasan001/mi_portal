import s from './FirmaDetalleTecnicoCard.module.css';

type ArchivoInfo = {
  nombreArchivo?: string | null;
  mimeType?: string | null;
  contenidoBase64?: string | null;
};

type FirmanteInfo = {
  nombre?: string | null;
  correo?: string | null;
  organizacion?: string | null;
  serieCertificado?: string | null;
  vigenciaInicio?: string | null;
  vigenciaFin?: string | null;
};

type AutoridadCertificadoraInfo = {
  nombre?: string | null;
  unidadOrganizacional?: string | null;
  organizacion?: string | null;
};

type FirmaCriptograficaInfo = {
  hashAlgoritmoDetectado?: string | null;
  algoritmoFirma?: string | null;
  firmaCrudaBytes?: number | null;
  firmaHex?: string | null;
};

type OcspInfo = {
  tipoDetectado?: string | null;
  fechaProduccion?: string | null;
  hashCertConsultado?: string | null;
  serieConsultada?: string | null;
  issuerNameHash?: string | null;
  issuerKeyHash?: string | null;
  thisUpdate?: string | null;
  nonce?: string | null;
};

type TspInfo = {
  tipoDetectado?: string | null;
  estado?: string | null;
  hashAlgorithm?: string | null;
  messageImprint?: string | null;
  numeroSerieSello?: string | null;
  fechaSello?: string | null;
  tsa?: string | null;
};

type FirmaDetalleTecnicoData = {
  identificadorFirma?: string | null;
  archivo?: ArchivoInfo | null;
  firmante?: FirmanteInfo | null;
  autoridadCertificadora?: AutoridadCertificadoraInfo | null;
  firmaCriptografica?: FirmaCriptograficaInfo | null;
  ocsp?: OcspInfo | null;
  tsp?: TspInfo | null;
};

type Props = {
  loading: boolean;
  error: string | null;
  data: FirmaDetalleTecnicoData | null;
};

/**
 * Normaliza cualquier valor vacío o nulo
 * para que la UI muestre un valor consistente.
 */
function getValue(value?: string | number | null): string {
  if (value === null || value === undefined) {
    return 'No disponible';
  }

  if (typeof value === 'string' && value.trim() === '') {
    return 'No disponible';
  }

  return String(value);
}

/**
 * Acorta cadenas muy largas para que la UI
 * no se rompa visualmente.
 */
function getLongValue(value?: string | null, max = 120): string {
  const normalized = getValue(value);

  if (normalized === 'No disponible') {
    return normalized;
  }

  if (normalized.length <= max) {
    return normalized;
  }

  return `${normalized.slice(0, max)}...`;
}

export default function FirmaDetalleTecnicoCard({
  loading,
  error,
  data,
}: Props) {
  if (loading) {
    return (
      <article className={s.card}>
        <div className={s.header}>
          <div>
            <h3>Detalle técnico</h3>
            <p>Cargando información técnica de la solicitud.</p>
          </div>
        </div>
      </article>
    );
  }

  if (error) {
    return (
      <article className={s.card}>
        <div className={s.header}>
          <div>
            <h3>Detalle técnico</h3>
            <p>No fue posible cargar la información técnica.</p>
          </div>
        </div>
      </article>
    );
  }

  if (!data) {
    return (
      <article className={s.card}>
        <div className={s.header}>
          <div>
            <h3>Detalle técnico</h3>
            <p>No hay información técnica disponible para esta solicitud.</p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={s.card}>
      <div className={s.header}>
        <div>
          <h3>Detalle técnico</h3>
          <p>Información técnica relacionada con el archivo, certificado y evidencia de firma.</p>
        </div>
      </div>

      <div className={s.sections}>
        <section className={s.section}>
          <h4 className={s.sectionTitle}>Resumen</h4>
          <dl className={s.grid}>
            <div className={s.item}>
              <dt>Identificador de firma</dt>
              <dd>{getValue(data.identificadorFirma)}</dd>
            </div>

            <div className={s.item}>
              <dt>Nombre archivo</dt>
              <dd>{getValue(data.archivo?.nombreArchivo)}</dd>
            </div>

            <div className={s.item}>
              <dt>Mime Type</dt>
              <dd>{getValue(data.archivo?.mimeType)}</dd>
            </div>

            <div className={s.item}>
              <dt>Contenido Base64</dt>
              <dd>{data.archivo?.contenidoBase64 ? 'Disponible' : 'No disponible'}</dd>
            </div>
          </dl>
        </section>

        <section className={s.section}>
          <h4 className={s.sectionTitle}>Firmante</h4>
          <dl className={s.grid}>
            <div className={s.item}>
              <dt>Nombre</dt>
              <dd>{getValue(data.firmante?.nombre)}</dd>
            </div>

            <div className={s.item}>
              <dt>Correo</dt>
              <dd>{getValue(data.firmante?.correo)}</dd>
            </div>

            <div className={s.item}>
              <dt>Organización</dt>
              <dd>{getValue(data.firmante?.organizacion)}</dd>
            </div>

            <div className={s.item}>
              <dt>Serie certificado</dt>
              <dd>{getValue(data.firmante?.serieCertificado)}</dd>
            </div>

            <div className={s.item}>
              <dt>Vigencia inicio</dt>
              <dd>{getValue(data.firmante?.vigenciaInicio)}</dd>
            </div>

            <div className={s.item}>
              <dt>Vigencia fin</dt>
              <dd>{getValue(data.firmante?.vigenciaFin)}</dd>
            </div>
          </dl>
        </section>

        <section className={s.section}>
          <h4 className={s.sectionTitle}>Autoridad certificadora</h4>
          <dl className={s.grid}>
            <div className={s.item}>
              <dt>Nombre</dt>
              <dd>{getValue(data.autoridadCertificadora?.nombre)}</dd>
            </div>

            <div className={s.item}>
              <dt>Unidad organizacional</dt>
              <dd>{getValue(data.autoridadCertificadora?.unidadOrganizacional)}</dd>
            </div>

            <div className={s.item}>
              <dt>Organización</dt>
              <dd>{getValue(data.autoridadCertificadora?.organizacion)}</dd>
            </div>
          </dl>
        </section>

        <section className={s.section}>
          <h4 className={s.sectionTitle}>Firma criptográfica</h4>
          <dl className={s.grid}>
            <div className={s.item}>
              <dt>Hash algoritmo detectado</dt>
              <dd>{getValue(data.firmaCriptografica?.hashAlgoritmoDetectado)}</dd>
            </div>

            <div className={s.item}>
              <dt>Algoritmo de firma</dt>
              <dd>{getValue(data.firmaCriptografica?.algoritmoFirma)}</dd>
            </div>

            <div className={s.item}>
              <dt>Firma cruda bytes</dt>
              <dd>{getValue(data.firmaCriptografica?.firmaCrudaBytes)}</dd>
            </div>

            <div className={`${s.item} ${s.itemFull}`}>
              <dt>Firma Hex</dt>
              <dd title={getValue(data.firmaCriptografica?.firmaHex)}>
                {getLongValue(data.firmaCriptografica?.firmaHex, 220)}
              </dd>
            </div>
          </dl>
        </section>

        <section className={s.section}>
          <h4 className={s.sectionTitle}>OCSP</h4>
          <dl className={s.grid}>
            <div className={s.item}>
              <dt>Tipo detectado</dt>
              <dd>{getValue(data.ocsp?.tipoDetectado)}</dd>
            </div>

            <div className={s.item}>
              <dt>Fecha producción</dt>
              <dd>{getValue(data.ocsp?.fechaProduccion)}</dd>
            </div>

            <div className={s.item}>
              <dt>Hash cert. consultado</dt>
              <dd>{getValue(data.ocsp?.hashCertConsultado)}</dd>
            </div>

            <div className={s.item}>
              <dt>Serie consultada</dt>
              <dd>{getValue(data.ocsp?.serieConsultada)}</dd>
            </div>

            <div className={s.item}>
              <dt>Issuer Name Hash</dt>
              <dd>{getValue(data.ocsp?.issuerNameHash)}</dd>
            </div>

            <div className={s.item}>
              <dt>Issuer Key Hash</dt>
              <dd>{getValue(data.ocsp?.issuerKeyHash)}</dd>
            </div>

            <div className={s.item}>
              <dt>This Update</dt>
              <dd>{getValue(data.ocsp?.thisUpdate)}</dd>
            </div>

            <div className={s.item}>
              <dt>Nonce</dt>
              <dd>{getValue(data.ocsp?.nonce)}</dd>
            </div>
          </dl>
        </section>

        <section className={s.section}>
          <h4 className={s.sectionTitle}>TSP</h4>
          <dl className={s.grid}>
            <div className={s.item}>
              <dt>Tipo detectado</dt>
              <dd>{getValue(data.tsp?.tipoDetectado)}</dd>
            </div>

            <div className={s.item}>
              <dt>Estado</dt>
              <dd>{getValue(data.tsp?.estado)}</dd>
            </div>

            <div className={s.item}>
              <dt>Hash algorithm</dt>
              <dd>{getValue(data.tsp?.hashAlgorithm)}</dd>
            </div>

            <div className={s.item}>
              <dt>Message imprint</dt>
              <dd>{getValue(data.tsp?.messageImprint)}</dd>
            </div>

            <div className={s.item}>
              <dt>Número serie sello</dt>
              <dd>{getValue(data.tsp?.numeroSerieSello)}</dd>
            </div>

            <div className={s.item}>
              <dt>Fecha sello</dt>
              <dd>{getValue(data.tsp?.fechaSello)}</dd>
            </div>

            <div className={s.item}>
              <dt>TSA</dt>
              <dd>{getValue(data.tsp?.tsa)}</dd>
            </div>
          </dl>
        </section>
      </div>
    </article>
  );
}