import NominaExplorerToolbar from '@/features/admin/nomina/shared/ui/NominaExplorerToolbar/NominaExplorerToolbar';

type Props = {
  query: string;
  stageOptions: string[];
  stageValue: string;
  statusOptions: string[];
  statusValue: string;
  sortValue: 'asc' | 'desc';
  onQueryChange: (value: string) => void;
  onStageChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSortChange: (value: 'asc' | 'desc') => void;
  onCreate: () => void;
};

export default function NominaCargaExplorerToolbar({
  query,
  stageOptions,
  stageValue,
  statusOptions,
  statusValue,
  sortValue,
  onQueryChange,
  onStageChange,
  onStatusChange,
  onSortChange,
  onCreate,
}: Props) {
  return (
    <NominaExplorerToolbar
      layout="versiones"
      onCreate={onCreate}
      controls={[
        {
          kind: 'search',
          label: 'Búsqueda',
          placeholder: 'Buscar por fileId, versión, período o archivo',
          value: query,
          onChange: onQueryChange,
        },
        {
          kind: 'select',
          label: 'Etapa',
          value: stageValue,
          onChange: onStageChange,
          options: [
            { label: 'Todas', value: 'all' },
            ...stageOptions.map((value) => ({ label: value, value })),
          ],
        },
        {
          kind: 'select',
          label: 'Estatus',
          value: statusValue,
          onChange: onStatusChange,
          options: [
            { label: 'Todos', value: 'all' },
            ...statusOptions.map((value) => ({ label: value, value })),
          ],
        },
        {
          kind: 'select',
          label: 'Orden',
          value: sortValue,
          onChange: (value) => onSortChange(value as 'asc' | 'desc'),
          withOrderIcon: true,
          options: [
            { label: 'Mayor fileId primero', value: 'desc' },
            { label: 'Menor fileId primero', value: 'asc' },
          ],
        },
      ]}
    />
  );
}
