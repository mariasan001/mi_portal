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
};

export default function NominaRecibosExplorerToolbar({
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
}: Props) {
  return (
    <NominaExplorerToolbar
      layout="versiones"
      controls={[
        {
          kind: 'search',
          label: 'Busqueda',
          placeholder: 'Buscar por version, periodo o estatus',
          value: query,
          onChange: onQueryChange,
        },
        {
          kind: 'select',
          label: 'Tipo',
          value: stageValue,
          onChange: onStageChange,
          options: [
            { label: 'Todos', value: 'all' },
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
            { label: 'Mayor version primero', value: 'desc' },
            { label: 'Menor version primero', value: 'asc' },
          ],
        },
      ]}
    />
  );
}
