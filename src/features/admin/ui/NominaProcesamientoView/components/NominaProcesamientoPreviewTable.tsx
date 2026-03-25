import { PayrollPreviewRowDto } from '@/features/admin/types/nomina-procesamiento.types';
import s from './NominaProcesamientoPreviewTable.module.css';

type Props = {
  rows: PayrollPreviewRowDto[];
};

export default function NominaProcesamientoPreviewTable({ rows }: Props) {
  return (
    <div className={s.tableWrap}>
      <table className={s.table}>
        <thead>
          <tr>
            <th>rowNum</th>
            <th>fileType</th>
            <th>payPeriodCode</th>
            <th>receiptPeriodCode</th>
            <th>neyemp</th>
            <th>neyrfc</th>
            <th>negnom</th>
            <th>necpza</th>
            <th>nominaTipo</th>
            <th>loadStatus</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={`${row.fileId}-${row.rowNum}`}>
              <td>{row.rowNum}</td>
              <td>{row.fileType}</td>
              <td>{row.payPeriodCode}</td>
              <td>{row.receiptPeriodCode}</td>
              <td>{row.neyemp}</td>
              <td>{row.neyrfc}</td>
              <td>{row.negnom}</td>
              <td>{row.necpza}</td>
              <td>{row.nominaTipo}</td>
              <td>{row.loadStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}