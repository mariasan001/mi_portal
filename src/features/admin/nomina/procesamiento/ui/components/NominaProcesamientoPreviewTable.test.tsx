import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { PayrollPreviewRowDto } from '@/features/admin/nomina/procesamiento/model/procesamiento.types';
import NominaProcesamientoPreviewTable from './NominaProcesamientoPreviewTable';

vi.mock('motion/react', () => ({
  motion: {
    section: ({ children, ...props }: React.ComponentProps<'section'>) => (
      <section {...props}>{children}</section>
    ),
    tr: ({ children, ...props }: React.ComponentProps<'tr'>) => <tr {...props}>{children}</tr>,
  },
  useReducedMotion: () => true,
}));

function buildRow(rowNum: number): PayrollPreviewRowDto {
  return {
    fileId: 12,
    rowNum,
    fileType: 'TCALC',
    payPeriodCode: '072026',
    receiptPeriodCode: '072026',
    neyemp: `EMP-${rowNum}`,
    neyrfc: `RFC-${rowNum}`,
    negnom: `Empleado ${rowNum}`,
    necpza: `PZA-${rowNum}`,
    necads: 'ADS',
    neccat: 'CAT',
    negppa: 'GPPA',
    necche: 'CHE',
    necrec: 'REC',
    necsex: 'M',
    netipi: 'BASE',
    nefocuRaw: 'RAW',
    fechaOcupacionInicio: '2026-04-01',
    fechaOcupacionFin: '2026-04-15',
    ocupacionIndefinida: false,
    nominaTipo: 1,
    isReexpedition: false,
    neitpe: 1,
    neitde: 1,
    neipne: 1,
    loadStatus: 'PROCESSED',
  };
}

describe('NominaProcesamientoPreviewTable', () => {
  it('shows translated status and paginates rows', async () => {
    const user = userEvent.setup();
    const rows = Array.from({ length: 11 }, (_, index) => buildRow(index + 1));

    render(<NominaProcesamientoPreviewTable rows={rows} />);

    expect(screen.getByText('Pagina 1 de 2')).toBeInTheDocument();
    expect(screen.getByText('Empleado 1')).toBeInTheDocument();
    expect(screen.queryByText('Empleado 11')).not.toBeInTheDocument();
    expect(screen.getAllByText('Procesado').length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: 'Siguiente' }));

    expect(screen.getByText('Pagina 2 de 2')).toBeInTheDocument();
    expect(screen.getByText('Empleado 11')).toBeInTheDocument();
    expect(screen.queryByText('Empleado 1')).not.toBeInTheDocument();
  });
});
