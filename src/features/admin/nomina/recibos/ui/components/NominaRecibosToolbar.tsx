import { Play, Search } from 'lucide-react';

import type { RecibosAction } from '@/features/admin/nomina/recibos/model/recibos.types';
import {
  NominaToolbarButton,
  NominaToolbarInput,
  NominaToolbarLabel,
  NominaToolbarShell,
  NominaToolbarSurface,
} from '@/features/admin/nomina/shared/ui/NominaToolbar/NominaToolbar';

type Props = {
  activeAction: RecibosAction;
  versionId: string;
  loading: boolean;
  canExecute: boolean;
  onChangeVersionId: (value: string) => void;
  onExecute: () => void;
};

function getButtonLabel(action: RecibosAction, loading: boolean): string {
  if (action === 'snapshots') {
    return loading ? 'Generando...' : 'Generar snapshots';
  }

  if (action === 'recibos') {
    return loading ? 'Generando...' : 'Generar recibos';
  }

  if (action === 'sincronizacion') {
    return loading ? 'Sincronizando...' : 'Ejecutar sincronizacion';
  }

  return loading ? 'Procesando...' : 'Ejecutar';
}

export default function NominaRecibosToolbar({
  activeAction,
  versionId,
  loading,
  canExecute,
  onChangeVersionId,
  onExecute,
}: Props) {
  return (
    <NominaToolbarShell>
      <NominaToolbarLabel htmlFor="nomina-recibos-version-id">
        ID de version
      </NominaToolbarLabel>

      <NominaToolbarSurface>
        <NominaToolbarInput
          icon={<Search size={16} />}
          input={
            <input
              id="nomina-recibos-version-id"
              type="number"
              min="1"
              value={versionId}
              onChange={(e) => onChangeVersionId(e.target.value)}
              placeholder="Ej. 125"
            />
          }
        />

        <NominaToolbarButton
          icon={<Play size={16} />}
          disabled={!canExecute || loading}
          onClick={onExecute}
        >
          {getButtonLabel(activeAction, loading)}
        </NominaToolbarButton>
      </NominaToolbarSurface>
    </NominaToolbarShell>
  );
}
