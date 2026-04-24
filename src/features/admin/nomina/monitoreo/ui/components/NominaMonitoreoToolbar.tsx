import { RotateCcw, Search } from 'lucide-react';

import {
  NominaToolbarButton,
  NominaToolbarInput,
  NominaToolbarLabel,
  NominaToolbarShell,
  NominaToolbarSurface,
} from '@/features/admin/nomina/shared/ui/NominaToolbar/NominaToolbar';

type Props = {
  payPeriodId: string;
  loading: boolean;
  canSubmit: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
};

export default function NominaMonitoreoToolbar({
  payPeriodId,
  loading,
  canSubmit,
  onChange,
  onSubmit,
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
      <NominaToolbarLabel htmlFor="nomina-monitoreo-period-id">
        payPeriodId
      </NominaToolbarLabel>

      <NominaToolbarSurface>
        <NominaToolbarInput
          icon={<Search size={16} />}
          input={
            <input
              id="nomina-monitoreo-period-id"
              type="number"
              min="1"
              value={payPeriodId}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Ej. 202601"
            />
          }
        />

        <NominaToolbarButton disabled={!canSubmit || loading} onClick={onSubmit}>
          {loading ? 'Consultando...' : 'Consultar estado'}
        </NominaToolbarButton>
      </NominaToolbarSurface>
    </NominaToolbarShell>
  );
}
