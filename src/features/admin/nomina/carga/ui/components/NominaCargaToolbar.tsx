import { Plus, Play, Search } from 'lucide-react';

import {
  NominaToolbarButton,
  NominaToolbarInput,
  NominaToolbarLabel,
  NominaToolbarShell,
  NominaToolbarSurface,
} from '@/features/admin/nomina/shared/ui/NominaToolbar/NominaToolbar';
import {
  getToolbarPrimaryLabel,
  getToolbarSearchLabel,
  getToolbarSearchPlaceholder,
} from '../../model/carga.selectors';
import type { NominaCargaEntity } from '../../model/carga.types';

type Props = {
  activeEntity: NominaCargaEntity;
  searchFileId: string;
  loading: boolean;
  canExecute: boolean;
  onSearchFileIdChange: (value: string) => void;
  onExecute: () => void;
  onPrimaryAction: () => void;
};

export default function NominaCargaToolbar({
  activeEntity,
  searchFileId,
  loading,
  canExecute,
  onSearchFileIdChange,
  onExecute,
  onPrimaryAction,
}: Props) {
  return (
    <NominaToolbarShell
      aside={
        <NominaToolbarButton
          icon={<Plus size={16} />}
          onClick={onPrimaryAction}
          disabled={loading}
          tone="accent"
        >
          {getToolbarPrimaryLabel(activeEntity)}
        </NominaToolbarButton>
      }
    >
      <NominaToolbarLabel htmlFor="nomina-carga-search-id">
        {getToolbarSearchLabel(activeEntity)}
      </NominaToolbarLabel>

      <NominaToolbarSurface>
        <NominaToolbarInput
          icon={<Search size={16} />}
          input={
            <input
              id="nomina-carga-search-id"
              type="number"
              min="1"
              value={searchFileId}
              onChange={(e) => onSearchFileIdChange(e.target.value)}
              placeholder={getToolbarSearchPlaceholder(activeEntity)}
            />
          }
        />

        <NominaToolbarButton
          icon={<Play size={16} />}
          disabled={!canExecute || loading}
          onClick={onExecute}
        >
          {loading ? 'Ejecutando...' : 'Ejecutar'}
        </NominaToolbarButton>
      </NominaToolbarSurface>
    </NominaToolbarShell>
  );
}
