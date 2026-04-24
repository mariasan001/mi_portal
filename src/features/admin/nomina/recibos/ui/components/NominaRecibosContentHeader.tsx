import type { NominaRecibosSummaryItem } from '../types/nomina-recibos-view.types';
import NominaSectionHeader from '@/features/admin/nomina/shared/ui/NominaSectionHeader/NominaSectionHeader';

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  status?: string;
  summaryItems?: NominaRecibosSummaryItem[];
  showSummary?: boolean;
};

export default function NominaRecibosContentHeader({
  eyebrow,
  title,
  description,
  status,
  summaryItems = [],
  showSummary = false,
}: Props) {
  return (
    <NominaSectionHeader
      eyebrow={eyebrow}
      title={title}
      description={description}
      status={status}
      summaryItems={summaryItems}
      showSummary={showSummary}
      summaryColumns={2}
    />
  );
}
