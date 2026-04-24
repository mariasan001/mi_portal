import { CalendarRange, Layers3 } from 'lucide-react';

import NominaOptionCards from '@/features/admin/nomina/shared/ui/NominaOptionCards/NominaOptionCards';
import { NominaEntity } from '../types/nomina-configuracion.types';

type Props = {
  activeEntity: NominaEntity;
  onSelect: (entity: NominaEntity) => void;
};

const options = [
  {
    value: 'periodo',
    title: 'Periodos',
    description:
      'Consulta periodos existentes y registra nuevos periodos de pago con sus fechas clave.',
    icon: CalendarRange,
  },
  {
    value: 'version',
    title: 'Versiones',
    description:
      'Consulta versiones por ID y crea una nueva version asociada al periodo y etapa correspondiente.',
    icon: Layers3,
  },
] as const;

export default function NominaEntityCards({ activeEntity, onSelect }: Props) {
  return (
    <NominaOptionCards
      activeValue={activeEntity}
      onSelect={onSelect}
      options={options}
    />
  );
}
