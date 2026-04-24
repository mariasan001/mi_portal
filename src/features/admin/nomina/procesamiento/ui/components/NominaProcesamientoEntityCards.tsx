import { AlertTriangle, BarChart3, Eye } from 'lucide-react';

import NominaOptionCards from '@/features/admin/nomina/shared/ui/NominaOptionCards/NominaOptionCards';

type ProcesamientoView = 'summary' | 'preview' | 'errors';

type Props = {
  activeView: ProcesamientoView;
  onSelect: (view: ProcesamientoView) => void;
};

const options = [
  {
    value: 'summary',
    title: 'Resumen',
    description:
      'Consulta metricas generales del archivo procesado, estatus y conteos principales.',
    icon: BarChart3,
  },
  {
    value: 'preview',
    title: 'Preview',
    description:
      'Revisa una muestra de filas procesadas para validar la informacion operativa del archivo.',
    icon: Eye,
  },
  {
    value: 'errors',
    title: 'Errores',
    description:
      'Consulta filas con incidencias detectadas durante el procesamiento para revisar el motivo del error.',
    icon: AlertTriangle,
  },
] as const;

export default function NominaProcesamientoEntityCards({
  activeView,
  onSelect,
}: Props) {
  return (
    <NominaOptionCards
      activeValue={activeView}
      columns={3}
      onSelect={onSelect}
      options={options}
    />
  );
}
