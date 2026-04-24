import type { NominaBusquedaRecibosSummaryItem } from '../types/nomina-busqueda-recibos-view.types';
import NominaSectionHeader from '@/features/admin/nomina/shared/ui/NominaSectionHeader/NominaSectionHeader';

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  summaryItems?: NominaBusquedaRecibosSummaryItem[];
  showSummary?: boolean;
};

export default function NominaBusquedaRecibosContentHeader({
  eyebrow,
  title,
  description,
  summaryItems = [],
  showSummary = false,
}: Props) {
  return (
    <NominaSectionHeader
      eyebrow={eyebrow}
      title={title}
      description={description}
      summaryItems={summaryItems}
      showSummary={showSummary}
      summaryColumns={3}
    />
  );
}
