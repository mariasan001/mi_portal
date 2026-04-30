'use client';

import { Search } from 'lucide-react';

import NominaExplorerToolbar from '@/features/admin/nomina/shared/ui/NominaExplorerToolbar/NominaExplorerToolbar';

type Props = {
  claveSp: string;
  periodCode: string;
  periodOptions: Array<{
    label: string;
    value: string;
  }>;
  loading: boolean;
  canSearch: boolean;
  onChangeClaveSp: (value: string) => void;
  onChangePeriodCode: (value: string) => void;
  onSearch: () => void;
};

export default function NominaBusquedaRecibosToolbar({
  claveSp,
  periodCode,
  periodOptions,
  loading,
  canSearch,
  onChangeClaveSp,
  onChangePeriodCode,
  onSearch,
}: Props) {
  return (
    <NominaExplorerToolbar
      layout="busqueda"
      action={{
        label: loading ? 'Consultando...' : 'Buscar recibos',
        onClick: onSearch,
        disabled: !canSearch || loading,
        icon: Search,
      }}
      controls={[
        {
          kind: 'search',
          label: 'Busqueda',
          placeholder: 'Buscar por clave SP',
          value: claveSp,
          onChange: onChangeClaveSp,
        },
        {
          kind: 'select',
          label: 'Periodo',
          value: periodCode,
          onChange: onChangePeriodCode,
          options: [
            { label: 'Selecciona un periodo', value: '' },
            ...periodOptions,
          ],
        },
      ]}
    />
  );
}
