'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import type {
  ReciboBusquedaConceptDetailDto,
  ReciboBusquedaItemDto,
  ReciboBusquedaPlazaDto,
  ReciboBusquedaTaxDetailDto,
} from '../../types/nomina-busqueda-recibos.types';
import s from './NominaBusquedaRecibosView.module.css';
import { useNominaBusquedaRecibos } from '../../hook/useNominaBusquedaRecibos';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 2,
  }).format(value ?? 0);
}

function formatDateTime(value: string): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('es-MX');
}

function formatDate(value: string): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('es-MX');
}

export default function NominaBusquedaRecibosView() {
  const vm = useNominaBusquedaRecibos();

  const [claveSp, setClaveSp] = useState('');
  const [periodCode, setPeriodCode] = useState('');

  const handleConsultar = async () => {
    const clave = claveSp.trim();
    const period = periodCode.trim();

    if (!clave || !period) {
      toast.error('Debes capturar clave SP y period code');
      return;
    }

    try {
      await vm.consultar({
        claveSp: clave,
        periodCode: period,
      });

      toast.success('Recibos consultados correctamente');
    } catch {
      toast.error('No se pudo consultar la búsqueda de recibos');
    }
  };

  return (
    <section className={s.page}>
      <header className={s.hero}>
        <div>
          <p className={s.eyebrow}>Administración de nómina</p>
          <h1>Búsqueda por servidor público y periodo</h1>
          <p className={s.heroText}>
            Consulta recibos completos por clave SP y periodo, considerando
            reexpediciones y mostrando encabezado, plazas, detalle fiscal y
            conceptos.
          </p>
        </div>
      </header>

      <section className={s.searchCard}>
        <div className={s.formGrid}>
          <label className={s.field}>
            <span>Clave SP</span>
            <input
              value={claveSp}
              onChange={(e) => setClaveSp(e.target.value)}
              placeholder="Ej. ABC12345"
            />
          </label>

          <label className={s.field}>
            <span>Period code</span>
            <input
              value={periodCode}
              onChange={(e) => setPeriodCode(e.target.value)}
              placeholder="Ej. 2025-06"
            />
          </label>
        </div>

        <div className={s.actions}>
          <button
            type="button"
            className={s.primaryButton}
            onClick={handleConsultar}
            disabled={vm.loading}
          >
            {vm.loading ? 'Consultando...' : 'Buscar recibos'}
          </button>
        </div>

        {vm.error ? <div className={s.errorBox}>{vm.error}</div> : null}
      </section>

      <section className={s.summaryCard}>
        <div className={s.summaryGrid}>
          <div className={s.summaryItem}>
            <span>Clave SP</span>
            <strong>{vm.data?.claveSp ?? '—'}</strong>
          </div>

          <div className={s.summaryItem}>
            <span>Periodo buscado</span>
            <strong>{vm.data?.searchedPeriodCode ?? '—'}</strong>
          </div>

          <div className={s.summaryItem}>
            <span>Total de recibos</span>
            <strong>{vm.data?.totalReceipts ?? 0}</strong>
          </div>
        </div>
      </section>

      <section className={s.resultsStack}>
        {(vm.data?.receipts ?? []).length === 0 ? (
          <article className={s.emptyCard}>
            No hay recibos para mostrar con los criterios consultados.
          </article>
        ) : (
          (vm.data?.receipts ?? []).map((receipt: ReciboBusquedaItemDto) => (
            <article className={s.receiptCard} key={receipt.header.receiptId}>
              <div className={s.receiptHeader}>
                <div>
                  <p className={s.receiptBadge}>
                    Recibo #{receipt.header.receiptId}
                  </p>
                  <h2>{receipt.header.nombre}</h2>
                  <p className={s.receiptSubline}>
                    {receipt.header.claveSp} · RFC {receipt.header.rfc}
                  </p>
                </div>

                <div className={s.receiptTotals}>
                  <div>
                    <span>Percepciones</span>
                    <strong>
                      {formatCurrency(receipt.header.totalPercepciones)}
                    </strong>
                  </div>
                  <div>
                    <span>Deducciones</span>
                    <strong>
                      {formatCurrency(receipt.header.totalDeducciones)}
                    </strong>
                  </div>
                  <div>
                    <span>Neto</span>
                    <strong>{formatCurrency(receipt.header.neto)}</strong>
                  </div>
                </div>
              </div>

              <div className={s.infoGrid}>
                <div className={s.infoItem}>
                  <span>Revision ID</span>
                  <strong>{receipt.header.revisionId}</strong>
                </div>
                <div className={s.infoItem}>
                  <span>Revision No</span>
                  <strong>{receipt.header.revisionNo}</strong>
                </div>
                <div className={s.infoItem}>
                  <span>Tipo nómina</span>
                  <strong>{receipt.header.nominaTipo}</strong>
                </div>
                <div className={s.infoItem}>
                  <span>Reexpedición</span>
                  <strong>{receipt.header.isReexpedition ? 'Sí' : 'No'}</strong>
                </div>
                <div className={s.infoItem}>
                  <span>Periodo pago</span>
                  <strong>{receipt.header.payPeriodCode}</strong>
                </div>
                <div className={s.infoItem}>
                  <span>Periodo recibo</span>
                  <strong>{receipt.header.receiptPeriodCode}</strong>
                </div>
                <div className={s.infoItem}>
                  <span>Stage</span>
                  <strong>{receipt.header.stage}</strong>
                </div>
                <div className={s.infoItem}>
                  <span>Liberado</span>
                  <strong>{formatDateTime(receipt.header.releasedAt)}</strong>
                </div>
                <div className={s.infoItem}>
                  <span>Fuente NEG/PPA</span>
                  <strong>{receipt.header.sourceNegppa || '—'}</strong>
                </div>
                <div className={s.infoItem}>
                  <span>NECCHE</span>
                  <strong>{receipt.header.necche || '—'}</strong>
                </div>
                <div className={s.infoItem}>
                  <span>NECREC</span>
                  <strong>{receipt.header.necrec || '—'}</strong>
                </div>
                <div className={s.infoItem}>
                  <span>NECSEX</span>
                  <strong>{receipt.header.necsex || '—'}</strong>
                </div>
                <div className={s.infoItem}>
                  <span>NETIPI</span>
                  <strong>{receipt.header.netipi || '—'}</strong>
                </div>
                <div className={s.infoItem}>
                  <span>Plaza principal</span>
                  <strong>{receipt.header.plazaPrincipal || '—'}</strong>
                </div>
                <div className={s.infoItem}>
                  <span>Adscripción principal</span>
                  <strong>{receipt.header.adscripcionPrincipal || '—'}</strong>
                </div>
                <div className={s.infoItem}>
                  <span>Puesto principal</span>
                  <strong>{receipt.header.puestoPrincipal || '—'}</strong>
                </div>
                <div className={s.infoItem}>
                  <span>Centro de trabajo principal</span>
                  <strong>{receipt.header.centroTrabajoPrincipal || '—'}</strong>
                </div>
                <div className={s.infoItem}>
                  <span>Categoría principal</span>
                  <strong>{receipt.header.categoriaPrincipal || '—'}</strong>
                </div>
                <div className={s.infoItem}>
                  <span>Cuenta pagadora principal</span>
                  <strong>{receipt.header.cuentaPagadoraPrincipal || '—'}</strong>
                </div>
                <div className={s.infoItem}>
                  <span>NEFOCU raw</span>
                  <strong>{receipt.header.nefocuRaw || '—'}</strong>
                </div>
                <div className={s.infoItem}>
                  <span>Inicio ocupación</span>
                  <strong>{formatDate(receipt.header.fechaOcupacionInicio)}</strong>
                </div>
                <div className={s.infoItem}>
                  <span>Fin ocupación</span>
                  <strong>{formatDate(receipt.header.fechaOcupacionFin)}</strong>
                </div>
                <div className={s.infoItem}>
                  <span>Ocupación indefinida</span>
                  <strong>
                    {receipt.header.ocupacionIndefinida ? 'Sí' : 'No'}
                  </strong>
                </div>
              </div>

              <section className={s.subsection}>
                <div className={s.subsectionHeader}>
                  <h3>Plazas</h3>
                  <span>{receipt.plazas.length}</span>
                </div>

                <div className={s.tableWrap}>
                  <table className={s.table}>
                    <thead>
                      <tr>
                        <th>Plaza</th>
                        <th>Adscripción</th>
                        <th>Puesto</th>
                        <th>Centro trabajo</th>
                        <th>Categoría</th>
                        <th>Cuenta pagadora</th>
                        <th>NEFOCU</th>
                        <th>Inicio</th>
                        <th>Fin</th>
                        <th>Indefinida</th>
                        <th>Percepciones</th>
                        <th>Deducciones</th>
                        <th>Neto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receipt.plazas.length === 0 ? (
                        <tr>
                          <td colSpan={13} className={s.emptyCell}>
                            Sin plazas.
                          </td>
                        </tr>
                      ) : (
                        receipt.plazas.map((plaza: ReciboBusquedaPlazaDto, index) => (
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
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className={s.subsection}>
                <div className={s.subsectionHeader}>
                  <h3>Detalle fiscal</h3>
                  <span>{receipt.taxDetails.length}</span>
                </div>

                <div className={s.tableWrap}>
                  <table className={s.table}>
                    <thead>
                      <tr>
                        <th>Plaza</th>
                        <th>Tax bucket</th>
                        <th>Source file type</th>
                        <th>Cuenta pagadora</th>
                        <th>Percepciones</th>
                        <th>Deducciones</th>
                        <th>Neto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receipt.taxDetails.length === 0 ? (
                        <tr>
                          <td colSpan={7} className={s.emptyCell}>
                            Sin detalle fiscal.
                          </td>
                        </tr>
                      ) : (
                        receipt.taxDetails.map(
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
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className={s.subsection}>
                <div className={s.subsectionHeader}>
                  <h3>Conceptos</h3>
                  <span>{receipt.conceptDetails.length}</span>
                </div>

                <div className={s.tableWrap}>
                  <table className={s.table}>
                    <thead>
                      <tr>
                        <th>Plaza</th>
                        <th>Concepto ID</th>
                        <th>Descripción</th>
                        <th>Tipo</th>
                        <th>Importe</th>
                        <th>Orden</th>
                        <th>Tax bucket</th>
                        <th>Source file type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receipt.conceptDetails.length === 0 ? (
                        <tr>
                          <td colSpan={8} className={s.emptyCell}>
                            Sin conceptos.
                          </td>
                        </tr>
                      ) : (
                        receipt.conceptDetails.map(
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
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </article>
          ))
        )}
      </section>
    </section>
  );
}