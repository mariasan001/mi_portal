import type {
  ReciboBusquedaConceptDetailDto,
  ReciboBusquedaItemDto,
  ReciboBusquedaPlazaDto,
  ReciboBusquedaTaxDetailDto,
} from '../../../types/nomina-busqueda-recibos.types';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
} from '../utils/nomina-busqueda-recibos-view.utils';
import ReciboTableSection from './ReciboTableSection';
import s from './ReciboCard.module.css';

type Props = {
  receipt: ReciboBusquedaItemDto;
};

export default function ReciboCard({ receipt }: Props) {
  return (
    <article className={s.receiptCard}>
      <div className={s.receiptHeader}>
        <div>
          <p className={s.receiptBadge}>Recibo #{receipt.header.receiptId}</p>
          <h2>{receipt.header.nombre}</h2>
          <p className={s.receiptSubline}>
            {receipt.header.claveSp} · RFC {receipt.header.rfc}
          </p>
        </div>

        <div className={s.receiptTotals}>
          <div>
            <span>Percepciones</span>
            <strong>{formatCurrency(receipt.header.totalPercepciones)}</strong>
          </div>
          <div>
            <span>Deducciones</span>
            <strong>{formatCurrency(receipt.header.totalDeducciones)}</strong>
          </div>
          <div>
            <span>Neto</span>
            <strong>{formatCurrency(receipt.header.neto)}</strong>
          </div>
        </div>
      </div>

      <div className={s.infoGrid}>
        <InfoItem label="Revision ID" value={receipt.header.revisionId} />
        <InfoItem label="Revision No" value={receipt.header.revisionNo} />
        <InfoItem label="Tipo nómina" value={receipt.header.nominaTipo} />
        <InfoItem
          label="Reexpedición"
          value={receipt.header.isReexpedition ? 'Sí' : 'No'}
        />
        <InfoItem label="Periodo pago" value={receipt.header.payPeriodCode} />
        <InfoItem
          label="Periodo recibo"
          value={receipt.header.receiptPeriodCode}
        />
        <InfoItem label="Stage" value={receipt.header.stage} />
        <InfoItem
          label="Liberado"
          value={formatDateTime(receipt.header.releasedAt)}
        />
        <InfoItem
          label="Fuente NEG/PPA"
          value={receipt.header.sourceNegppa || '—'}
        />
        <InfoItem label="NECCHE" value={receipt.header.necche || '—'} />
        <InfoItem label="NECREC" value={receipt.header.necrec || '—'} />
        <InfoItem label="NECSEX" value={receipt.header.necsex || '—'} />
        <InfoItem label="NETIPI" value={receipt.header.netipi || '—'} />
        <InfoItem
          label="Plaza principal"
          value={receipt.header.plazaPrincipal || '—'}
        />
        <InfoItem
          label="Adscripción principal"
          value={receipt.header.adscripcionPrincipal || '—'}
        />
        <InfoItem
          label="Puesto principal"
          value={receipt.header.puestoPrincipal || '—'}
        />
        <InfoItem
          label="Centro de trabajo principal"
          value={receipt.header.centroTrabajoPrincipal || '—'}
        />
        <InfoItem
          label="Categoría principal"
          value={receipt.header.categoriaPrincipal || '—'}
        />
        <InfoItem
          label="Cuenta pagadora principal"
          value={receipt.header.cuentaPagadoraPrincipal || '—'}
        />
        <InfoItem label="NEFOCU raw" value={receipt.header.nefocuRaw || '—'} />
        <InfoItem
          label="Inicio ocupación"
          value={formatDate(receipt.header.fechaOcupacionInicio)}
        />
        <InfoItem
          label="Fin ocupación"
          value={formatDate(receipt.header.fechaOcupacionFin)}
        />
        <InfoItem
          label="Ocupación indefinida"
          value={receipt.header.ocupacionIndefinida ? 'Sí' : 'No'}
        />
      </div>

      <ReciboTableSection
        title="Plazas"
        count={receipt.plazas.length}
        headers={[
          'Plaza',
          'Adscripción',
          'Puesto',
          'Centro trabajo',
          'Categoría',
          'Cuenta pagadora',
          'NEFOCU',
          'Inicio',
          'Fin',
          'Indefinida',
          'Percepciones',
          'Deducciones',
          'Neto',
        ]}
        emptyMessage="Sin plazas."
      >
        {receipt.plazas.length === 0
          ? null
          : receipt.plazas.map((plaza: ReciboBusquedaPlazaDto, index) => (
              <tr key={`${receipt.header.receiptId}-plaza-${index}`}>
                <td>{plaza.plaza}</td>
                <td>
                  {plaza.adscripcionDesc}
                  <br />
                  <span className={s.muted}>{plaza.adscripcionId}</span>
                </td>
                <td>
                  {plaza.puestoDesc}
                  <br />
                  <span className={s.muted}>{plaza.puestoId}</span>
                </td>
                <td>
                  {plaza.centroTrabajoDesc}
                  <br />
                  <span className={s.muted}>{plaza.centroTrabajoId}</span>
                </td>
                <td>{plaza.categoria}</td>
                <td>{plaza.cuentaPagadora}</td>
                <td>{plaza.nefocuRaw}</td>
                <td>{formatDate(plaza.fechaOcupacionInicio)}</td>
                <td>{formatDate(plaza.fechaOcupacionFin)}</td>
                <td>{plaza.ocupacionIndefinida ? 'Sí' : 'No'}</td>
                <td>{formatCurrency(plaza.totalPercepciones)}</td>
                <td>{formatCurrency(plaza.totalDeducciones)}</td>
                <td>{formatCurrency(plaza.neto)}</td>
              </tr>
            ))}
      </ReciboTableSection>

      <ReciboTableSection
        title="Detalle fiscal"
        count={receipt.taxDetails.length}
        headers={[
          'Plaza',
          'Tax bucket',
          'Source file type',
          'Cuenta pagadora',
          'Percepciones',
          'Deducciones',
          'Neto',
        ]}
        emptyMessage="Sin detalle fiscal."
      >
        {receipt.taxDetails.length === 0
          ? null
          : receipt.taxDetails.map(
              (detail: ReciboBusquedaTaxDetailDto, index) => (
                <tr key={`${receipt.header.receiptId}-tax-${index}`}>
                  <td>{detail.plaza}</td>
                  <td>{detail.taxBucket}</td>
                  <td>{detail.sourceFileType}</td>
                  <td>{detail.cuentaPagadora}</td>
                  <td>{formatCurrency(detail.totalPercepciones)}</td>
                  <td>{formatCurrency(detail.totalDeducciones)}</td>
                  <td>{formatCurrency(detail.neto)}</td>
                </tr>
              )
            )}
      </ReciboTableSection>

      <ReciboTableSection
        title="Conceptos"
        count={receipt.conceptDetails.length}
        headers={[
          'Plaza',
          'Concepto ID',
          'Descripción',
          'Tipo',
          'Importe',
          'Orden',
          'Tax bucket',
          'Source file type',
        ]}
        emptyMessage="Sin conceptos."
      >
        {receipt.conceptDetails.length === 0
          ? null
          : receipt.conceptDetails.map(
              (concept: ReciboBusquedaConceptDetailDto, index) => (
                <tr key={`${receipt.header.receiptId}-concept-${index}`}>
                  <td>{concept.plaza}</td>
                  <td>{concept.conceptoId}</td>
                  <td>{concept.conceptoDesc}</td>
                  <td>{concept.conceptoTipo}</td>
                  <td>{formatCurrency(concept.importe)}</td>
                  <td>{concept.orden}</td>
                  <td>{concept.taxBucket}</td>
                  <td>{concept.sourceFileType}</td>
                </tr>
              )
            )}
      </ReciboTableSection>
    </article>
  );
}

type InfoItemProps = {
  label: string;
  value: string | number;
};

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className={s.infoItem}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}