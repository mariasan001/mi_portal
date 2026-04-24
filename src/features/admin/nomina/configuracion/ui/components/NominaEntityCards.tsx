import { CalendarRange, Layers3 } from 'lucide-react';

import NominaOptionCards from '@/features/admin/nomina/shared/ui/NominaOptionCards/NominaOptionCards';
import type { ConfiguracionEntity } from '../../model/configuracion.types';

type Props = {
  activeEntity: ConfiguracionEntity;
  onSelect: (entity: ConfiguracionEntity) => void;
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
      'Consulta versiones por ID y crea una nueva versión asociada al período y etapa correspondiente.',
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
