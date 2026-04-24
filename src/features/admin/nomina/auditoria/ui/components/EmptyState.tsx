
import NominaEmptyState from '@/features/admin/nomina/shared/ui/NominaEmptyState/NominaEmptyState';

type EmptyStateVariant = 'default' | 'success' | 'search';

type Props = {
  title: string;
  description: string;
  variant?: EmptyStateVariant;
};

export default function EmptyState({
  title,
  description,
  variant = 'default',
}: Props) {
  return <NominaEmptyState title={title} description={description} variant={variant} />;
}
