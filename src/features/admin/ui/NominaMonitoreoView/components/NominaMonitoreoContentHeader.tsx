import NominaSectionHeader from '@/features/admin/nomina/shared/ui/NominaSectionHeader/NominaSectionHeader';

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
};

export default function NominaMonitoreoContentHeader({
  eyebrow,
  title,
  description,
}: Props) {
  return <NominaSectionHeader eyebrow={eyebrow} title={title} description={description} />;
}
