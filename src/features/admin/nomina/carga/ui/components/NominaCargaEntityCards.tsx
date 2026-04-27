import { Database, Files } from 'lucide-react';

import NominaOptionCards from '@/features/admin/nomina/shared/ui/NominaOptionCards/NominaOptionCards';
import type { NominaCargaEntity } from '../../model/carga.types';

type Props = {
  activeEntity: NominaCargaEntity;
  onSelect: (entity: NominaCargaEntity) => void;
};

const options = [
  {
    value: 'catalogo',
    title: 'Catálogos',
    description: 'Sube archivos DBF, ejecútalos y consulta el resultado del proceso.',
    icon: Files,
  },
  {
    value: 'nomina',
    title: 'Nómina',
    description: 'Ejecuta el staging por fileId y visualiza el resultado más reciente.',
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
