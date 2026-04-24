import { Database, Files } from 'lucide-react';

import NominaOptionCards from '@/features/admin/nomina/shared/ui/NominaOptionCards/NominaOptionCards';
import { NominaCargaEntity } from '../types/nomina-cargas.types';

type Props = {
  activeEntity: NominaCargaEntity;
  onSelect: (entity: NominaCargaEntity) => void;
};

const options = [
  {
    value: 'catalogo',
    title: 'Catalogos',
    description: 'Sube archivos DBF, ejecutalos y consulta el resultado del proceso.',
    icon: Files,
  },
  {
    value: 'nomina',
    title: 'Nomina',
    description: 'Ejecuta el staging por fileId y visualiza el resultado mas reciente.',
    icon: Database,
  },
] as const;

export default function NominaCargaEntityCards({
  activeEntity,
  onSelect,
}: Props) {
  return (
    <NominaOptionCards
      activeValue={activeEntity}
      onSelect={onSelect}
      options={options}
    />
  );
}
