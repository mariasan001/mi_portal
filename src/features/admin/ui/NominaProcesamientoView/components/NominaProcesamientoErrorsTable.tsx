import { PayrollErrorRowDto } from '@/features/admin/types/nomina-procesamiento.types';
import s from './NominaProcesamientoErrorsTable.module.css';

type Props = {
  rows: PayrollErrorRowDto[];
};

export default function NominaProcesamientoErrorsTable({ rows }: Props) {
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
            <th>necpza</th>
            <th>nominaTipo</th>
            <th>isReexpedition</th>
            <th>errorDetail</th>
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
              <td>{row.necpza}</td>
              <td>{row.nominaTipo}</td>
              <td>{row.isReexpedition ? 'Sí' : 'No'}</td>
              <td className={s.errorDetail}>{row.errorDetail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}