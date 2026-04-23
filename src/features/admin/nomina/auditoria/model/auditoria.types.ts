export type {
  AuditCancellationItemDto,
  AuditCancellationsQuery,
  AuditCancellationsResponseDto,
  AuditReleaseItemDto,
  AuditReleasesQuery,
  AuditReleasesResponseDto,
} from '@/features/admin/types/nomina-auditoria.types';

export type AuditoriaAction = 'liberaciones' | 'cancelaciones';

export type AuditoriaReleaseFormState = {
  versionId: string;
  payPeriodCode: string;
  stage: string;
};

export type AuditoriaCancellationFormState = {
  receiptId: string;
  claveSp: string;
  payPeriodCode: string;
  receiptPeriodCode: string;
  nominaTipo: string;
};

export type AuditoriaSummaryItem = {
  label: string;
  value: string;
};
