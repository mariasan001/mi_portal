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
  const mappedVariant = variant === 'default' ? 'inbox' : variant;

  return <NominaEmptyState title={title} description={description} variant={mappedVariant} />;
}
