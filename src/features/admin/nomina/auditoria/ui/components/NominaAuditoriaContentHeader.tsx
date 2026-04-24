
import type { NominaAuditoriaSummaryItem } from '../types/nomina-auditoria-view.types';
import NominaSectionHeader from '@/features/admin/nomina/shared/ui/NominaSectionHeader/NominaSectionHeader';

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  summaryItems?: NominaAuditoriaSummaryItem[];
  showSummary?: boolean;
};

export default function NominaAuditoriaContentHeader({
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
