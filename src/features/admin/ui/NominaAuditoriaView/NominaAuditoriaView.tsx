'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import type {
  AuditCancellationItemDto,
  AuditReleaseItemDto,
} from '../../types/nomina-auditoria.types';
import s from './NominaAuditoriaView.module.css';
import { useNominaAuditoria } from '../../hook/useNominaAuditoria';

function parseOptionalNumber(value: string): number | undefined {
  if (!value.trim()) {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  return Math.trunc(parsed);
}

function formatDate(value: string): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('es-MX');
}

export default function NominaAuditoriaView() {
  const vm = useNominaAuditoria();

  const [releaseVersionId, setReleaseVersionId] = useState('');
  const [releasePayPeriodCode, setReleasePayPeriodCode] = useState('');
  const [releaseStage, setReleaseStage] = useState('');
  const [releaseLimit, setReleaseLimit] = useState('20');
  const [releaseOffset, setReleaseOffset] = useState('0');

  const [cancelReceiptId, setCancelReceiptId] = useState('');
  const [cancelClaveSp, setCancelClaveSp] = useState('');
  const [cancelPayPeriodCode, setCancelPayPeriodCode] = useState('');
  const [cancelReceiptPeriodCode, setCancelReceiptPeriodCode] = useState('');
  const [cancelNominaTipo, setCancelNominaTipo] = useState('');
  const [cancelLimit, setCancelLimit] = useState('20');
  const [cancelOffset, setCancelOffset] = useState('0');

  const releasesQuery = useMemo(
    () => ({
      versionId: parseOptionalNumber(releaseVersionId),
      payPeriodCode: releasePayPeriodCode.trim() || undefined,
      stage: releaseStage.trim() || undefined,
      limit: parseOptionalNumber(releaseLimit) ?? 20,
      offset: parseOptionalNumber(releaseOffset) ?? 0,
    }),
    [releaseVersionId, releasePayPeriodCode, releaseStage, releaseLimit, releaseOffset]
  );

  const cancellationsQuery = useMemo(
    () => ({
      receiptId: parseOptionalNumber(cancelReceiptId),
      claveSp: cancelClaveSp.trim() || undefined,
      payPeriodCode: cancelPayPeriodCode.trim() || undefined,
      receiptPeriodCode: cancelReceiptPeriodCode.trim() || undefined,
      nominaTipo: parseOptionalNumber(cancelNominaTipo),
      limit: parseOptionalNumber(cancelLimit) ?? 20,
      offset: parseOptionalNumber(cancelOffset) ?? 0,
    }),
    [
      cancelReceiptId,
      cancelClaveSp,
      cancelPayPeriodCode,
      cancelReceiptPeriodCode,
      cancelNominaTipo,
      cancelLimit,
      cancelOffset,
    ]
  );

  const handleConsultarLiberaciones = async () => {
    try {
      await vm.consultarLiberaciones(releasesQuery);
      toast.success('Auditoría de liberaciones consultada');
    } catch {
      toast.error('No se pudo consultar la auditoría de liberaciones');
    }
  };

  const handleConsultarCancelaciones = async () => {
    try {
      await vm.consultarCancelaciones(cancellationsQuery);
      toast.success('Auditoría de cancelaciones consultada');
    } catch {
      toast.error('No se pudo consultar la auditoría de cancelaciones');
    }
  };

  return (
    <section className={s.page}>
      <header className={s.hero}>
        <div>
          <p className={s.eyebrow}>Administración de nómina</p>
          <h1>Auditorías</h1>
          <p className={s.heroText}>
            Consulta los eventos administrativos de liberación y cancelación con filtros
            por versión, periodo, etapa, recibo o llave de negocio.
          </p>
        </div>
      </header>

      <section className={s.grid}>
        <article className={s.card}>
          <div className={s.cardHeader}>
            <h2>Auditoría de liberaciones</h2>
            <p>Consulta la bitácora por versión, periodo o etapa.</p>
          </div>

          <div className={s.formGrid}>
            <label className={s.field}>
              <span>Version ID</span>
              <input
                type="number"
                value={releaseVersionId}
                onChange={(e) => setReleaseVersionId(e.target.value)}
                placeholder="Ej. 125"
              />
            </label>

            <label className={s.field}>
              <span>Pay period code</span>
              <input
                value={releasePayPeriodCode}
                onChange={(e) => setReleasePayPeriodCode(e.target.value)}
                placeholder="Ej. 2025-06"
              />
            </label>

            <label className={s.field}>
              <span>Stage</span>
              <input
                value={releaseStage}
                onChange={(e) => setReleaseStage(e.target.value)}
                placeholder="Ej. INTEGRADA"
              />
            </label>

            <label className={s.field}>
              <span>Limit</span>
              <input
                type="number"
                value={releaseLimit}
                onChange={(e) => setReleaseLimit(e.target.value)}
              />
            </label>

            <label className={s.field}>
              <span>Offset</span>
              <input
                type="number"
                value={releaseOffset}
                onChange={(e) => setReleaseOffset(e.target.value)}
              />
            </label>
          </div>

          <div className={s.actions}>
            <button
              type="button"
              className={s.primaryButton}
              onClick={handleConsultarLiberaciones}
              disabled={vm.releases.loading}
            >
              {vm.releases.loading ? 'Consultando...' : 'Consultar liberaciones'}
            </button>
          </div>

          {vm.releases.error ? <div className={s.errorBox}>{vm.releases.error}</div> : null}

          <div className={s.metaBox}>
            <strong>Total:</strong> {vm.releases.data?.total ?? 0} · <strong>Limit:</strong>{' '}
            {vm.releases.data?.limit ?? '—'} · <strong>Offset:</strong>{' '}
            {vm.releases.data?.offset ?? '—'}
          </div>

          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Evento</th>
                  <th>Versión</th>
                  <th>Periodo</th>
                  <th>Stage</th>
                  <th>Liberó</th>
                  <th>Fecha</th>
                  <th>Scope</th>
                  <th>Comentarios</th>
                </tr>
              </thead>
              <tbody>
                {(vm.releases.data?.items ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={8} className={s.emptyCell}>
                      No hay resultados para mostrar.
                    </td>
                  </tr>
                ) : (
                  (vm.releases.data?.items ?? []).map((item: AuditReleaseItemDto) => (
                    <tr key={item.releaseEventId}>
                      <td>{item.releaseEventId}</td>
                      <td>{item.versionId}</td>
                      <td>
                        {item.periodCode}
                        <br />
                        <span className={s.muted}>ID: {item.payPeriodId}</span>
                      </td>
                      <td>{item.stage}</td>
                      <td>{item.releasedByUserId}</td>
                      <td>{formatDate(item.releasedAt)}</td>
                      <td>{item.releaseScope}</td>
                      <td>{item.comments || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className={s.card}>
          <div className={s.cardHeader}>
            <h2>Auditoría de cancelaciones</h2>
            <p>Consulta la bitácora por recibo o llave de negocio.</p>
          </div>

          <div className={s.formGrid}>
            <label className={s.field}>
              <span>Receipt ID</span>
              <input
                type="number"
                value={cancelReceiptId}
                onChange={(e) => setCancelReceiptId(e.target.value)}
                placeholder="Ej. 4501"
              />
            </label>

            <label className={s.field}>
              <span>Clave SP</span>
              <input
                value={cancelClaveSp}
                onChange={(e) => setCancelClaveSp(e.target.value)}
                placeholder="Ej. ABC123"
              />
            </label>

            <label className={s.field}>
              <span>Pay period code</span>
              <input
                value={cancelPayPeriodCode}
                onChange={(e) => setCancelPayPeriodCode(e.target.value)}
                placeholder="Ej. 2025-06"
              />
            </label>

            <label className={s.field}>
              <span>Receipt period code</span>
              <input
                value={cancelReceiptPeriodCode}
                onChange={(e) => setCancelReceiptPeriodCode(e.target.value)}
                placeholder="Ej. 2025-06-Q1"
              />
            </label>

            <label className={s.field}>
              <span>Nómina tipo</span>
              <input
                type="number"
                value={cancelNominaTipo}
                onChange={(e) => setCancelNominaTipo(e.target.value)}
                placeholder="Ej. 1"
              />
            </label>

            <label className={s.field}>
              <span>Limit</span>
              <input
                type="number"
                value={cancelLimit}
                onChange={(e) => setCancelLimit(e.target.value)}
              />
            </label>

            <label className={s.field}>
              <span>Offset</span>
              <input
                type="number"
                value={cancelOffset}
                onChange={(e) => setCancelOffset(e.target.value)}
              />
            </label>
          </div>

          <div className={s.actions}>
            <button
              type="button"
              className={s.primaryButton}
              onClick={handleConsultarCancelaciones}
              disabled={vm.cancellations.loading}
            >
              {vm.cancellations.loading ? 'Consultando...' : 'Consultar cancelaciones'}
            </button>
          </div>

          {vm.cancellations.error ? (
            <div className={s.errorBox}>{vm.cancellations.error}</div>
          ) : null}

          <div className={s.metaBox}>
            <strong>Total:</strong> {vm.cancellations.data?.total ?? 0} · <strong>Limit:</strong>{' '}
            {vm.cancellations.data?.limit ?? '—'} · <strong>Offset:</strong>{' '}
            {vm.cancellations.data?.offset ?? '—'}
          </div>

          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Evento</th>
                  <th>Receipt</th>
                  <th>Revision</th>
                  <th>Clave SP</th>
                  <th>Periodos</th>
                  <th>Tipo</th>
                  <th>Canceló</th>
                  <th>Fecha</th>
                  <th>Razón</th>
                  <th>Comentarios</th>
                </tr>
              </thead>
              <tbody>
                {(vm.cancellations.data?.items ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={10} className={s.emptyCell}>
                      No hay resultados para mostrar.
                    </td>
                  </tr>
                ) : (
                  (vm.cancellations.data?.items ?? []).map(
                    (item: AuditCancellationItemDto) => (
                      <tr key={item.cancellationEventId}>
                        <td>{item.cancellationEventId}</td>
                        <td>{item.receiptId}</td>
                        <td>{item.revisionId}</td>
                        <td>{item.claveSp}</td>
                        <td>
                          {item.payPeriodCode}
                          <br />
                          <span className={s.muted}>{item.receiptPeriodCode}</span>
                        </td>
                        <td>{item.nominaTipo}</td>
                        <td>{item.cancelledByUserId}</td>
                        <td>{formatDate(item.cancelledAt)}</td>
                        <td>{item.reason}</td>
                        <td>{item.comments || '—'}</td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </section>
  );
}