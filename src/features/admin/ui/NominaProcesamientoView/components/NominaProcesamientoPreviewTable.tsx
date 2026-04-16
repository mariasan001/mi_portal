'use client';

import { motion, useReducedMotion } from 'motion/react';
import { FileSpreadsheet } from 'lucide-react';

import type { PayrollPreviewRowDto } from '@/features/admin/types/nomina-procesamiento.types';
import s from './NominaProcesamientoPreviewTable.module.css';

type Props = {
  rows: PayrollPreviewRowDto[];
};

type StatusTone = 'ok' | 'warn' | 'danger' | 'neutral';

const columns: Array<{
  key: keyof PayrollPreviewRowDto | 'loadStatusBadge';
  label: string;
}> = [
  { key: 'rowNum', label: 'Fila' },
  { key: 'fileType', label: 'Tipo archivo' },
  { key: 'payPeriodCode', label: 'Periodo nómina' },
  { key: 'receiptPeriodCode', label: 'Periodo recibo' },
  { key: 'neyemp', label: 'Empleado' },
  { key: 'neyrfc', label: 'RFC' },
  { key: 'negnom', label: 'Nombre' },
  { key: 'necpza', label: 'Plaza' },
  { key: 'nominaTipo', label: 'Tipo nómina' },
  { key: 'loadStatusBadge', label: 'Estatus' },
];

function getStatusTone(value: string): StatusTone {
  const normalized = value.trim().toLowerCase();

  if (
    normalized.includes('ok') ||
    normalized.includes('success') ||
    normalized.includes('loaded') ||
    normalized.includes('process') ||
    normalized.includes('complete')
  ) {
    return 'ok';
  }

  if (
    normalized.includes('pending') ||
    normalized.includes('progress') ||
    normalized.includes('partial') ||
    normalized.includes('valid')
  ) {
    return 'warn';
  }

  if (
    normalized.includes('error') ||
    normalized.includes('fail') ||
    normalized.includes('reject')
  ) {
    return 'danger';
  }

  return 'neutral';
}

function formatCellValue(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  return String(value);
}

export default function NominaProcesamientoPreviewTable({ rows }: Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      className={s.panel}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
    >
      <div className={s.header}>
        <div className={s.headerMain}>
          <div className={s.iconWrap}>
            <FileSpreadsheet size={16} />
          </div>

          <div className={s.copy}>
            <h4>Vista previa del archivo procesado</h4>
            <p>
              Consulta los registros detectados en el lote con una presentación
              más clara, limpia y cómoda para revisión operativa.
            </p>
          </div>
        </div>

        <div className={s.counter}>
          <strong>{rows.length}</strong>
          <span>filas</span>
        </div>
      </div>

      <div className={s.tableShell}>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key}>{column.label}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => {
                const statusTone = getStatusTone(row.loadStatus);

                return (
                  <motion.tr
                    key={`${row.fileId}-${row.rowNum}-${index}`}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.16,
                      delay: shouldReduceMotion ? 0 : Math.min(index * 0.018, 0.14),
                    }}
                  >
                    <td>
                      <span className={s.rowIndex}>
                        {formatCellValue(row.rowNum)}
                      </span>
                    </td>

                    <td>
                      <span className={s.fileTypeBadge}>
                        {formatCellValue(row.fileType)}
                      </span>
                    </td>

                    <td className={s.periodCell}>
                      {formatCellValue(row.payPeriodCode)}
                    </td>

                    <td className={s.periodCell}>
                      {formatCellValue(row.receiptPeriodCode)}
                    </td>

                    <td className={s.employeeCell}>
                      {formatCellValue(row.neyemp)}
                    </td>

                    <td className={s.rfcCell}>
                      {formatCellValue(row.neyrfc)}
                    </td>

                    <td className={s.nameCell}>
                      {formatCellValue(row.negnom)}
                    </td>

                    <td className={s.plazaCell}>
                      {formatCellValue(row.necpza)}
                    </td>

                    <td className={s.nominaCell}>
                      {formatCellValue(row.nominaTipo)}
                    </td>

                    <td>
                      <span className={`${s.statusBadge} ${s[statusTone]}`}>
                        {formatCellValue(row.loadStatus)}
                      </span>
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