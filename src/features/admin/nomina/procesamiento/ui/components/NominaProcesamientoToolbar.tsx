import { RotateCcw, Search } from 'lucide-react';

import {
  NominaToolbarButton,
  NominaToolbarInput,
  NominaToolbarLabel,
  NominaToolbarSecondaryInput,
  NominaToolbarShell,
  NominaToolbarSurface,
} from '@/features/admin/nomina/shared/ui/NominaToolbar/NominaToolbar';

type ProcesamientoView = 'summary' | 'preview' | 'errors';

type Props = {
  activeView: ProcesamientoView;
  fileId: string;
  limit: string;
  loading: boolean;
  canSubmit: boolean;
  onFileIdChange: (value: string) => void;
  onLimitChange: (value: string) => void;
  onConsult: () => void;
  onReset: () => void;
};

function getLabel(view: ProcesamientoView) {
  if (view === 'summary') return 'Consultar resumen';
  if (view === 'preview') return 'Consultar vista previa';
  return 'Consultar errores';
}

function getLimitLabel(view: ProcesamientoView) {
  return view === 'errors' ? 'Limite de errores' : 'Limite de filas';
}

export default function NominaProcesamientoToolbar({
  activeView,
  fileId,
  limit,
  loading,
  canSubmit,
  onFileIdChange,
  onLimitChange,
  onConsult,
  onReset,
}: Props) {
  return (
    <NominaToolbarShell
      aside={
        <NominaToolbarButton
          icon={<RotateCcw size={16} />}
          onClick={onReset}
          disabled={loading}
          tone="secondary"
        >
          Limpiar
        </NominaToolbarButton>
      }
    >
      <NominaToolbarLabel htmlFor="nomina-procesamiento-file-id">
        ID del archivo
      </NominaToolbarLabel>

      <NominaToolbarSurface>
        <NominaToolbarInput
          icon={<Search size={16} />}
          input={
            <input
              id="nomina-procesamiento-file-id"
              type="number"
              min="1"
              value={fileId}
              onChange={(e) => onFileIdChange(e.target.value)}
              placeholder="Ej. 40"
            />
          }
        />

        {activeView !== 'summary' ? (
          <NominaToolbarSecondaryInput
            label={getLimitLabel(activeView)}
            input={
              <input
                type="number"
                min="1"
                value={limit}
                onChange={(e) => onLimitChange(e.target.value)}
                placeholder={activeView === 'errors' ? '50' : '20'}
              />
            }
          />
        ) : null}

        <NominaToolbarButton
          icon={<Search size={16} />}
          disabled={!canSubmit || loading}
          onClick={onConsult}
        >
          {loading ? 'Consultando...' : getLabel(activeView)}
        </NominaToolbarButton>
      </NominaToolbarSurface>
    </NominaToolbarShell>
  );
}
