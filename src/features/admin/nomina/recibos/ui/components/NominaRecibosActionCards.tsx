import { FileStack, ReceiptText, RefreshCw } from 'lucide-react';

import type { RecibosAction } from '@/features/admin/nomina/recibos/model/recibos.types';
import NominaOptionCards from '@/features/admin/nomina/shared/ui/NominaOptionCards/NominaOptionCards';

type Props = {
  activeAction: RecibosAction;
  onSelect: (action: RecibosAction) => void;
};

const options = [
  {
    value: 'snapshots',
    title: 'Snapshots',
    description:
      'Genera snapshots consolidados desde staging para la version seleccionada.',
    icon: FileStack,
  },
  {
    value: 'recibos',
    title: 'Recibos',
    description:
      'Construye recibos y su detalle asociado a partir de snapshots previamente generados.',
    icon: ReceiptText,
  },
  {
    value: 'sincronizacion',
    title: 'Sincronizacion',
    description:
      'Ejecuta la sincronizacion complementaria a core para la version vigente.',
    icon: RefreshCw,
  },
] as const;

export default function NominaRecibosActionCards({
  activeAction,
  onSelect,
}: Props) {
  return (
    <NominaOptionCards
      activeValue={activeAction}
      columns={3}
      onSelect={onSelect}
      options={options}
    />
  );
}
