import { CalendarRange, Layers3 } from 'lucide-react';

import NominaOptionCards from '@/features/admin/nomina/shared/ui/NominaOptionCards/NominaOptionCards';

import type { ConfiguracionEntity } from '../../model/configuracion.types';

type Props = {
  activeEntity: ConfiguracionEntity;
  hasPeriodos: boolean;
  onSelect: (entity: ConfiguracionEntity) => void;
};

export default function NominaEntityCards({
  activeEntity,
  hasPeriodos,
  onSelect,
}: Props) {
  const options = [
    {
      value: 'periodo',
      title: 'Períodos',
      description:
        'Crea, revisa o selecciona el período base con sus fechas clave para iniciar el flujo.',
      icon: CalendarRange,
      badge: 'Paso 1',
    },
    {
      value: 'version',
      title: 'Versiones',
      description:
        'Asocia una versión al período elegido y define la etapa de trabajo correspondiente.',
      icon: Layers3,
      badge: hasPeriodos ? 'Paso 2' : 'Bloqueado',
      disabled: !hasPeriodos,
      disabledReason: hasPeriodos
        ? undefined
        : 'Primero crea al menos un período para habilitar este paso.',
    },
  ] as const;

  return <NominaOptionCards activeValue={activeEntity} onSelect={onSelect} options={options} />;
}
