import { Ban, ShieldCheck } from 'lucide-react';

import NominaOptionCards from '@/features/admin/nomina/shared/ui/NominaOptionCards/NominaOptionCards';
import type { NominaAuditoriaAction } from '../types/nomina-auditoria-view.types';

type Props = {
  activeAction: NominaAuditoriaAction;
  onSelect: (value: NominaAuditoriaAction) => void;
};

const options = [
  {
    value: 'liberaciones',
    title: 'Liberaciones',
    description: 'Consulta la bitacora administrativa por version, periodo o etapa.',
    icon: ShieldCheck,
  },
  {
    value: 'cancelaciones',
    title: 'Cancelaciones',
    description: 'Consulta la bitacora por recibo, periodos o llave de negocio.',
    icon: Ban,
  },
] as const;

export default function NominaAuditoriaActionCards({
  activeAction,
  onSelect,
}: Props) {
  return (
    <NominaOptionCards
      activeValue={activeAction}
      onSelect={onSelect}
      options={options}
    />
  );
}
