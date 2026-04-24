import { AlertTriangle } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import type { PayrollErrorRowDto } from '@/features/admin/nomina/procesamiento/model/procesamiento.types';
import { formatCellValue } from '@/features/admin/nomina/procesamiento/model/procesamiento.selectors';
import s from './NominaProcesamientoErrorsTable.module.css';

type Props = {
  rows: PayrollErrorRowDto[];
};

const columns: Array<{
  key: keyof PayrollErrorRowDto | 'reexpeditionBadge' | 'errorDetailCell';
  label: string;
}> = [
  { key: 'rowNum', label: 'Fila' },
  { key: 'fileType', label: 'Tipo archivo' },
  { key: 'payPeriodCode', label: 'Periodo nomina' },
  { key: 'receiptPeriodCode', label: 'Periodo recibo' },
  { key: 'neyemp', label: 'Empleado' },
  { key: 'necpza', label: 'Plaza' },
  { key: 'nominaTipo', label: 'Tipo nomina' },
  { key: 'reexpeditionBadge', label: 'Reexpedicion' },
  { key: 'errorDetailCell', label: 'Detalle del error' },
];

export default function NominaProcesamientoErrorsTable({ rows }: Props) {
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
                {columns.map((column) => (
                  <th key={column.key}>{column.label}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <motion.tr
                  key={`${row.fileId}-${row.rowNum}-${index}`}
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={shouldReduceMotion ? undefined : { opacity: 1 }}
                  transition={{
                    duration: 0.15,
                    delay: shouldReduceMotion ? 0 : Math.min(index * 0.01, 0.12),
                  }}
                >
                  <td>
                    <span className={s.rowIndex}>{formatCellValue(row.rowNum)}</span>
                  </td>

                  <td>
                    <span className={s.fileTypeBadge}>{formatCellValue(row.fileType)}</span>
                  </td>

                  <td className={s.cell}>{formatCellValue(row.payPeriodCode)}</td>
                  <td className={s.cell}>{formatCellValue(row.receiptPeriodCode)}</td>
                  <td className={s.cell}>{formatCellValue(row.neyemp)}</td>
                  <td className={s.plazaCell}>{formatCellValue(row.necpza)}</td>
                  <td className={s.cell}>{formatCellValue(row.nominaTipo)}</td>

                  <td>
                    <span
                      className={`${s.reexpeditionBadge} ${
                        row.isReexpedition ? s.warn : s.neutral
                      }`}
                    >
                      {row.isReexpedition ? 'Si' : 'No'}
                    </span>
                  </td>

                  <td className={s.errorCell}>
                    <div className={s.errorDetail}>
                      <span className={s.errorIcon}>
                        <AlertTriangle size={12} />
                      </span>

                      <p>{formatCellValue(row.errorDetail)}</p>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.section>
  );
}
