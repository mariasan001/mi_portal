
import NominaSectionHeader from '@/features/admin/nomina/shared/ui/NominaSectionHeader/NominaSectionHeader';

type Props = {
  eyebrow: string;
  title: string;
  showBackButton: boolean;
  onBack?: () => void;
};

export default function NominaContentHeader({
  eyebrow,
  title,
  showBackButton,
  onBack,
}: Props) {
  return (
    <NominaSectionHeader
      eyebrow={eyebrow}
      title={title}
      actionLabel={showBackButton ? 'Ver resultados' : undefined}
      onAction={showBackButton ? onBack : undefined}
    />
  );
}
