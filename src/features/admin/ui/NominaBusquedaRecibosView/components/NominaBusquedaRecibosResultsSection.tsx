import type { ReciboBusquedaItemDto } from '@/features/admin/nomina/busqueda-recibos/model/busqueda-recibos.types';
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
      <div className={s.group}>
        <div className={s.groupHeader}>
          <div className={s.groupHeaderCopy}>
            <span className={s.kicker}>Busqueda</span>
            <h3>Resultados localizados</h3>
            <p>
              Recibos completos localizados para los criterios consultados, con
              encabezado, plazas, detalle fiscal y conceptos asociados.
            </p>
          </div>
        </div>

        <div className={s.stack}>
          {receipts.map((receipt) => (
            <ReciboCard key={receipt.header.receiptId} receipt={receipt} />
          ))}
        </div>
      </div>
    </section>
  );
}
