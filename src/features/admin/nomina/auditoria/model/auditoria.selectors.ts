import type {
  AuditCancellationsQuery,
  AuditReleasesQuery,
  AuditoriaCancellationFormState,
  AuditoriaReleaseFormState,
  AuditoriaSummaryItem,
} from './auditoria.types';

export const PAGE_SIZE = 20;

export function parseOptionalNumber(value: string): number | undefined {
  if (!value.trim()) {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  return Math.trunc(parsed);
}

export function buildAuditSummary(params: {
  total?: number;
  limit?: number;
  offset?: number;
}): AuditoriaSummaryItem[] {
  const limit = params.limit ?? 20;
  const offset = params.offset ?? 0;
  const currentPage = limit > 0 ? Math.floor(offset / limit) + 1 : 1;

  return [
    {
      label: 'Total',
      value: String(params.total ?? 0),
    },
    {
      label: 'Pagina actual',
      value: String(currentPage),
    },
    {
      label: 'Por pagina',
      value: String(limit),
    },
  ];
}

export function buildReleaseFilters(
  form: AuditoriaReleaseFormState
): Omit<AuditReleasesQuery, 'limit' | 'offset'> {
  return {
    versionId: parseOptionalNumber(form.versionId),
    payPeriodCode: form.payPeriodCode.trim() || undefined,
    stage: form.stage.trim() || undefined,
  };
}

export function buildCancellationFilters(
  form: AuditoriaCancellationFormState
): Omit<AuditCancellationsQuery, 'limit' | 'offset'> {
  return {
    receiptId: parseOptionalNumber(form.receiptId),
    claveSp: form.claveSp.trim() || undefined,
    payPeriodCode: form.payPeriodCode.trim() || undefined,
    receiptPeriodCode: form.receiptPeriodCode.trim() || undefined,
    nominaTipo: parseOptionalNumber(form.nominaTipo),
  };
}
