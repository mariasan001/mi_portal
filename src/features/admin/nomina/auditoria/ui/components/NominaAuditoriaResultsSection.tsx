import type { ReactNode } from 'react';

import type {
  AuditCancellationItemDto,
  AuditReleaseItemDto,
} from '@/features/admin/nomina/auditoria/model/auditoria.types';
import type { NominaAuditoriaAction } from '../types/nomina-auditoria-view.types';
import { formatDate } from '../utils/nomina-auditoria-view.utils';
import s from './NominaAuditoriaResultsSection.module.css';

type Props = {
  activeAction: NominaAuditoriaAction;
  releases: AuditReleaseItemDto[];
  cancellations: AuditCancellationItemDto[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

type ResultsGroupProps = {
  kicker: string;
  tone: 'primary' | 'secondary';
  heading: string;
  description: string;
  children: ReactNode;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function NominaAuditoriaResultsSection({
  activeAction,
  releases,
  cancellations,
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  if (activeAction === 'liberaciones') {
    return (
      <ReleaseResultsGroup
        releases={releases}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    );
  }

  return (
    <CancellationResultsGroup
      cancellations={cancellations}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}

function ResultsGroup({
  kicker,
  tone,
  heading,
  description,
  children,
  currentPage,
  totalPages,
  onPageChange,
}: ResultsGroupProps) {
  return (
    <section className={s.section}>
      <div className={s.group}>
        <div className={s.groupHeader}>
          <div className={s.groupHeaderCopy}>
            <span className={tone === 'primary' ? s.kicker : s.kickerAlt}>
              {kicker}
            </span>
            <h3>{heading}</h3>
            <p>{description}</p>
          </div>
        </div>

        {children}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </section>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getVisiblePages(currentPage, totalPages);

  return (
    <div className={s.pagination}>
      <button
        type="button"
        className={s.paginationBtn}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Anterior
      </button>

      <div className={s.pageNumbers}>
        {pageNumbers.map((page) => (
          <button
            key={page}
            type="button"
            className={`${s.pageNumber} ${
              page === currentPage ? s.pageNumberActive : ''
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        className={s.paginationBtn}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Siguiente
      </button>
    </div>
  );
}

function getVisiblePages(currentPage: number, totalPages: number): number[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 5];
  }

  if (currentPage >= totalPages - 2) {
    return [
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    currentPage - 2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2,
  ];
}

function ReleaseResultsGroup({
  releases,
  currentPage,
  totalPages,
  onPageChange,
}: {
  releases: AuditReleaseItemDto[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <ResultsGroup
      kicker="Liberaciones"
      tone="primary"
      heading="Resultado de liberaciones"
      description="Consulta aqui la respuesta administrativa registrada para cada evento de liberacion, junto con su contexto de periodo y trazabilidad."
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    >
      <div className={s.tableWrap}>
        <table className={`${s.table} ${s.tableLiberaciones}`}>
          <thead>
            <tr>
              <th>Evento</th>
              <th>Version</th>
              <th>Periodo</th>
              <th>Stage</th>
              <th>Libero</th>
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
                  <td>{item.comments || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </ResultsGroup>
  );
}

function CancellationResultsGroup({
  cancellations,
  currentPage,
  totalPages,
  onPageChange,
}: {
  cancellations: AuditCancellationItemDto[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <ResultsGroup
      kicker="Cancelaciones"
      tone="secondary"
      heading="Resultado de cancelaciones"
      description="Consulta aqui la traza administrativa registrada para cada cancelacion encontrada, con los periodos y la razon asociada."
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    >
      <div className={s.tableWrap}>
        <table className={`${s.table} ${s.tableCancelaciones}`}>
          <thead>
            <tr>
              <th>Evento</th>
              <th>Receipt</th>
              <th>Revision</th>
              <th>Clave SP</th>
              <th>Periodos</th>
              <th>Tipo</th>
              <th>Cancelo</th>
              <th>Fecha</th>
              <th>Razon</th>
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
                  <td>{item.comments || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </ResultsGroup>
  );
}
