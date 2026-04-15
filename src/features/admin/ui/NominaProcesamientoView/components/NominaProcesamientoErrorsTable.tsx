'use client';

import { AlertTriangle } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import type { PayrollErrorRowDto } from '@/features/admin/types/nomina-procesamiento.types';
import s from './NominaProcesamientoErrorsTable.module.css';

type Props = {
  rows: PayrollErrorRowDto[];
};

const columns: Array<{
  key: keyof PayrollErrorRowDto | 'reexpeditionBadge' | 'errorDetailCell';
  label: string;
}> = [
  { key: 'rowNum', label: 'rowNum' },
  { key: 'fileType', label: 'fileType' },
  { key: 'payPeriodCode', label: 'payPeriodCode' },
  { key: 'receiptPeriodCode', label: 'receiptPeriodCode' },
  { key: 'neyemp', label: 'neyemp' },
  { key: 'necpza', label: 'necpza' },
  { key: 'nominaTipo', label: 'nominaTipo' },
  { key: 'reexpeditionBadge', label: 'isReexpedition' },
  { key: 'errorDetailCell', label: 'errorDetail' },
];

function formatCellValue(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  return String(value);
}

export default function NominaProcesamientoErrorsTable({ rows }: Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={s.panel}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
    >
      <div className={s.topBar}>
        <div className={s.copy}>
          <span className={s.kicker}>Errores</span>
          <h4>Filas con incidencias detectadas</h4>
          <p>
            Revisa el detalle de los registros que presentaron errores durante el
            procesamiento.
          </p>
        </div>

        <div className={s.counter}>
          <span>Total</span>
          <strong>{rows.length}</strong>
        </div>
      </div>

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
            {rows.map((row, index) => (
              <motion.tr
                key={`${row.fileId}-${row.rowNum}-${index}`}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{
                  duration: 0.16,
                  delay: shouldReduceMotion ? 0 : Math.min(index * 0.02, 0.18),
                }}
              >
                <td>
                  <span className={s.rowNum}>{formatCellValue(row.rowNum)}</span>
                </td>
                <td>{formatCellValue(row.fileType)}</td>
                <td>{formatCellValue(row.payPeriodCode)}</td>
                <td>{formatCellValue(row.receiptPeriodCode)}</td>
                <td>{formatCellValue(row.neyemp)}</td>
                <td>{formatCellValue(row.necpza)}</td>
                <td>{formatCellValue(row.nominaTipo)}</td>
                <td>
                  <span
                    className={`${s.reexpeditionBadge} ${
                      row.isReexpedition ? s.warn : s.neutral
                    }`}
                  >
                    {row.isReexpedition ? 'Sí' : 'No'}
                  </span>
                </td>
                <td>
                  <div className={s.errorDetail}>
                    <div className={s.errorIcon}>
                      <AlertTriangle size={14} />
                    </div>
                    <p>{formatCellValue(row.errorDetail)}</p>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}