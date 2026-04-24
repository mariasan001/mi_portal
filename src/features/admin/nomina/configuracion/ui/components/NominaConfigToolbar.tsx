import { Plus, Search } from 'lucide-react';

import {
  NominaToolbarButton,
  NominaToolbarInput,
  NominaToolbarLabel,
  NominaToolbarShell,
  NominaToolbarSurface,
} from '@/features/admin/nomina/shared/ui/NominaToolbar/NominaToolbar';

type Props = {
  searchLabel: string;
  searchPlaceholder: string;
  searchButtonLabel: string;
  searchId: string;
  loading: boolean;
  canSearch: boolean;
  onSearchIdChange: (value: string) => void;
  onSearch: () => void;
  onCreate: () => void;
};

export default function NominaConfigToolbar({
  searchLabel,
  searchPlaceholder,
  searchButtonLabel,
  searchId,
  loading,
  canSearch,
  onSearchIdChange,
  onSearch,
  onCreate,
}: Props) {
  return (
    <NominaToolbarShell
      aside={
        <NominaToolbarButton icon={<Plus size={16} />} onClick={onCreate} tone="accent">
          Crear nuevo
        </NominaToolbarButton>
      }
    >
      <NominaToolbarLabel htmlFor="nomina-search-id">
        {searchLabel}
      </NominaToolbarLabel>

      <NominaToolbarSurface>
        <NominaToolbarInput
          icon={<Search size={16} />}
          input={
            <input
              id="nomina-search-id"
              type="number"
              min="1"
              value={searchId}
              onChange={(e) => onSearchIdChange(e.target.value)}
              placeholder={searchPlaceholder}
            />
          }
        />

        <NominaToolbarButton disabled={!canSearch} onClick={onSearch}>
          {loading ? 'Consultando...' : searchButtonLabel}
        </NominaToolbarButton>
      </NominaToolbarSurface>
    </NominaToolbarShell>
  );
}
