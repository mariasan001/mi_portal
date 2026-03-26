import type { ReciboBusquedaItemDto } from '../../../types/nomina-busqueda-recibos.types';
import ReciboCard from './ReciboCard';
import s from './NominaBusquedaRecibosResultsSection.module.css';

type Props = {
  receipts: ReciboBusquedaItemDto[];
};

export default function NominaBusquedaRecibosResultsSection({
  receipts,
}: Props) {
  return (
    <section className={s.section}>
      <div className={s.header}>
        <h3>Resultados</h3>
        <p>Recibos completos localizados para los criterios consultados.</p>
      </div>

      <div className={s.stack}>
        {receipts.map((receipt) => (
          <ReciboCard key={receipt.header.receiptId} receipt={receipt} />
        ))}
      </div>
    </section>
  );
}