import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { PayrollErrorRowDto } from '@/features/admin/nomina/procesamiento/model/procesamiento.types';
import NominaProcesamientoErrorsTable from './NominaProcesamientoErrorsTable';

vi.mock('motion/react', () => ({
  motion: {
    section: ({ children, ...props }: React.ComponentProps<'section'>) => (
      <section {...props}>{children}</section>
    ),
    tr: ({ children, ...props }: React.ComponentProps<'tr'>) => <tr {...props}>{children}</tr>,
  },
  useReducedMotion: () => true,
}));

function buildRow(rowNum: number): PayrollErrorRowDto {
  return {
    fileId: 12,
    rowNum,
    fileType: 'TCALC',
    payPeriodCode: '072026',
    receiptPeriodCode: '072026',
    neyemp: `EMP-${rowNum}`,
    necpza: `PZA-${rowNum}`,
    nominaTipo: 1,
    isReexpedition: rowNum % 2 === 0,
    errorDetail: `Error ${rowNum}`,
  };
}

describe('NominaProcesamientoErrorsTable', () => {
  it('paginates error rows and keeps Spanish boolean labels', async () => {
    const user = userEvent.setup();
    const rows = Array.from({ length: 11 }, (_, index) => buildRow(index + 1));

    render(<NominaProcesamientoErrorsTable rows={rows} />);

    expect(screen.getByText('Pagina 1 de 2')).toBeInTheDocument();
    expect(screen.getByText('Error 1')).toBeInTheDocument();
    expect(screen.queryByText('Error 11')).not.toBeInTheDocument();
    expect(screen.getAllByText('No').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Si').length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: 'Siguiente' }));

    expect(screen.getByText('Pagina 2 de 2')).toBeInTheDocument();
    expect(screen.getByText('Error 11')).toBeInTheDocument();
    expect(screen.queryByText('Error 1')).not.toBeInTheDocument();
  });
});
