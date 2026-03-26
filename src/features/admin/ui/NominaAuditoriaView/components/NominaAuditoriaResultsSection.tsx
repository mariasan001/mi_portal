import type {
  AuditCancellationItemDto,
  AuditReleaseItemDto,
} from '../../../types/nomina-auditoria.types';
import type { NominaAuditoriaAction } from '../types/nomina-auditoria-view.types';
import { formatDate } from '../utils/nomina-auditoria-view.utils';
import s from './NominaAuditoriaResultsSection.module.css';

type Props = {
  activeAction: NominaAuditoriaAction;
  releases: AuditReleaseItemDto[];
  cancellations: AuditCancellationItemDto[];
};

export default function NominaAuditoriaResultsSection({
  activeAction,
  releases,
  cancellations,
}: Props) {
  if (activeAction === 'liberaciones') {
    return (
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
            {releases.length === 0 ? (
              <tr>
                <td colSpan={8} className={s.emptyCell}>
                  No hay resultados para mostrar.
                </td>
              </tr>
            ) : (
              releases.map((item) => (
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
    );
  }

  return (
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
          {cancellations.length === 0 ? (
            <tr>
              <td colSpan={10} className={s.emptyCell}>
                No hay resultados para mostrar.
              </td>
            </tr>
          ) : (
            cancellations.map((item) => (
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}