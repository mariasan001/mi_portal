'use client';

import { Search } from 'lucide-react';

import {
  NominaToolbarButton,
  NominaToolbarLabel,
  NominaToolbarSecondaryInput,
  NominaToolbarShell,
  NominaToolbarSurface,
} from '@/features/admin/nomina/shared/ui/NominaToolbar/NominaToolbar';

type Props = {
  claveSp: string;
  periodCode: string;
  loading: boolean;
  canSearch: boolean;
  onChangeClaveSp: (value: string) => void;
  onChangePeriodCode: (value: string) => void;
  onSearch: () => void;
};

export default function NominaBusquedaRecibosToolbar({
  claveSp,
  periodCode,
  loading,
  canSearch,
  onChangeClaveSp,
  onChangePeriodCode,
  onSearch,
}: Props) {
  return (
    <NominaToolbarShell
      aside={
        <NominaToolbarButton
          icon={<Search size={16} />}
          onClick={onSearch}
          disabled={!canSearch || loading}
        >
          {loading ? 'Consultando...' : 'Buscar recibos'}
        </NominaToolbarButton>
      }
    >
      <NominaToolbarLabel htmlFor="nomina-busqueda-clave-sp">
        Filtros de consulta
      </NominaToolbarLabel>

      <NominaToolbarSurface>
        <NominaToolbarSecondaryInput
          label="Clave SP"
          input={
            <input
              id="nomina-busqueda-clave-sp"
              value={claveSp}
              onChange={(event) => onChangeClaveSp(event.target.value)}
              placeholder="Ej. ABC12345"
            />
          }
        />

        <NominaToolbarSecondaryInput
          label="Período"
          input={
            <input
              id="nomina-busqueda-period-code"
              value={periodCode}
              onChange={(event) => onChangePeriodCode(event.target.value)}
              placeholder="Ej. 2025-06"
            />
          }
        />
      </NominaToolbarSurface>
    </NominaToolbarShell>
  );
}
