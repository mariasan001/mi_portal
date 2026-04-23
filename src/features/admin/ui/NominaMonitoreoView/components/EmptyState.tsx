import NominaEmptyState from '@/features/admin/nomina/shared/ui/NominaEmptyState/NominaEmptyState';

type Props = {
  title: string;
  description: string;
};

export default function EmptyState({ title, description }: Props) {
  return <NominaEmptyState title={title} description={description} variant="inbox" tone="compact" />;
}
