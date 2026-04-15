'use client';

import { motion, useReducedMotion } from 'motion/react';

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
  { key: 'rowNum', label: 'rowNum' },
  { key: 'fileType', label: 'fileType' },
  { key: 'payPeriodCode', label: 'payPeriodCode' },
  { key: 'receiptPeriodCode', label: 'receiptPeriodCode' },
  { key: 'neyemp', label: 'neyemp' },
  { key: 'neyrfc', label: 'neyrfc' },
  { key: 'negnom', label: 'negnom' },
  { key: 'necpza', label: 'necpza' },
  { key: 'nominaTipo', label: 'nominaTipo' },
  { key: 'loadStatusBadge', label: 'loadStatus' },
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
    <motion.div
      className={s.panel}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
    >
      <div className={s.topBar}>
        <div className={s.copy}>
          <span className={s.kicker}>Preview</span>
          <h4>Muestra de filas procesadas</h4>
          <p>Revisa una vista rápida del contenido cargado para validar datos clave.</p>
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
            {rows.map((row, index) => {
              const statusTone = getStatusTone(row.loadStatus);

              return (
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
                  <td>{formatCellValue(row.neyrfc)}</td>
                  <td>{formatCellValue(row.negnom)}</td>
                  <td>{formatCellValue(row.necpza)}</td>
                  <td>{formatCellValue(row.nominaTipo)}</td>
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
    </motion.div>
  );
}