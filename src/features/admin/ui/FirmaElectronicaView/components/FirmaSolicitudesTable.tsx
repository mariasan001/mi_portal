'use client';

import { Download, Eye, FileText } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import type { SolicitudFirmaListItemDto } from '../../../types/firma-electronica.types';
import { formatDateTime } from '../utils/firma-electronica-view.utils';
import s from './FirmaSolicitudesTable.module.css';

type Props = {
  items: SolicitudFirmaListItemDto[];
  selectedRequestId: string;
  onOpenDetails: (requestId: string) => void;
  onViewSignedPdf: (requestId: string) => void;
  onDownloadSignedPdf: (requestId: string) => void;
};

function getStatusClass(status: string): string {
  switch (status) {
    case 'PENDING':
      return s.pending;
    case 'PROCESSING':
      return s.processing;
    case 'SIGNED':
      return s.signed;
    case 'FAILED':
      return s.failed;
    default:
      return s.defaultStatus;
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'Pendiente';
    case 'PROCESSING':
      return 'Procesando';
    case 'SIGNED':
      return 'Firmado';
    case 'FAILED':
      return 'Fallido';
    default:
      return status || 'Sin estatus';
  }
}

function getDateParts(value: string | null): { date: string; time: string } {
  const formatted = formatDateTime(value);

  if (formatted === '-' || formatted === '—') {
    return {
      date: 'No disponible',
      time: '',
    };
  }

  const [date, time] = formatted.split(',');

  return {
    date: date?.trim() || formatted,
    time: time?.trim() || '',
  };
}

export default function FirmaSolicitudesTable({
  items,
  selectedRequestId,
  onOpenDetails,
  onViewSignedPdf,
  onDownloadSignedPdf,
}: Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      className={s.panel}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className={s.tableShell}>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Documento</th>
                <th>Estatus</th>
                <th>Proveedor</th>
                <th>Solicitado</th>
                <th>Completado</th>
                <th className={s.actionsHeader}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => {
                const isActive = selectedRequestId === item.requestId;
                const normalizedStatus = item.status?.trim().toUpperCase() ?? '';
                const isSigned = normalizedStatus === 'SIGNED';
                const requestedAt = getDateParts(item.requestedAt);
                const completedAt = getDateParts(item.completedAt);

                return (
                  <motion.tr
                    key={item.requestId}
                    className={isActive ? s.activeRow : ''}
                    initial={shouldReduceMotion ? false : { opacity: 0 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1 }}
                    transition={{ duration: 0.15, delay: index * 0.01 }}
                  >
                    <td className={s.nameCell}>
                      <span className={s.nameText} title={item.originalFileName}>
                        {item.originalFileName}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`${s.statusBadge} ${getStatusClass(normalizedStatus)}`}
                      >
                        {getStatusLabel(normalizedStatus)}
                      </span>
                    </td>

                    <td className={s.providerCell}>
                      <span
                        className={s.providerText}
                        title={item.providerSignatureId || '—'}
                      >
                        {item.providerSignatureId || '—'}
                      </span>
                    </td>

                    <td className={s.dateCell}>
                      <span className={s.dateMain}>{requestedAt.date}</span>
                      {requestedAt.time ? (
                        <span className={s.dateSub}>{requestedAt.time}</span>
                      ) : null}
                    </td>

                    <td className={s.dateCell}>
                      <span className={s.dateMain}>{completedAt.date}</span>
                      {completedAt.time ? (
                        <span className={s.dateSub}>{completedAt.time}</span>
                      ) : null}
                    </td>

                    <td>
                      <div className={s.actions}>
                        <button
                          type="button"
                          className={`${s.iconButton} ${s.detailsButton}`}
                          onClick={() => onOpenDetails(item.requestId)}
                          title="Ver detalle completo"
                          aria-label="Ver detalle completo"
                        >
                          <FileText size={15} strokeWidth={2.1} />
                        </button>

                        {isSigned ? (
                          <>
                            <button
                              type="button"
                              className={s.iconButton}
                              onClick={() => onViewSignedPdf(item.requestId)}
                              title="Ver PDF firmado"
                              aria-label="Ver PDF firmado"
                            >
                              <Eye size={15} strokeWidth={2.1} />
                            </button>

                            <button
                              type="button"
                              className={`${s.iconButton} ${s.downloadButton}`}
                              onClick={() => onDownloadSignedPdf(item.requestId)}
                              title="Descargar PDF firmado"
                              aria-label="Descargar PDF firmado"
                            >
                              <Download size={15} strokeWidth={2.1} />
                            </button>
                          </>
                        ) : null}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.section>
  );
}
