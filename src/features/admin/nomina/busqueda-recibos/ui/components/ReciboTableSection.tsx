import s from './ReciboTableSection.module.css';

type Props = {
  title: string;
  count: number;
  headers: string[];
  emptyMessage: string;
  children: React.ReactNode;
};

export default function ReciboTableSection({
  title,
  count,
  headers,
  emptyMessage,
  children,
}: Props) {
  return (
    <section className={s.subsection}>
      <div className={s.subsectionHeader}>
        <h3>{title}</h3>
        <span>{count}</span>
      </div>

      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>{children || (
            <tr>
              <td colSpan={headers.length} className={s.emptyCell}>
                {emptyMessage}
              </td>
            </tr>
          )}</tbody>
        </table>
      </div>
    </section>
  );
}