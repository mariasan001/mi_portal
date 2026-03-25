export type AuditReleasesQuery = {
  versionId?: number;
  payPeriodCode?: string;
  stage?: string;
  limit?: number;
  offset?: number;
};

export type AuditReleaseItemDto = {
  releaseEventId: number;
  versionId: number;
  payPeriodId: number;
  periodCode: string;
  stage: string;
  releasedByUserId: number;
  releasedAt: string;
  releaseScope: string;
  comments: string;
};

export type AuditReleasesResponseDto = {
  total: number;
  limit: number;
  offset: number;
  items: AuditReleaseItemDto[];
};

export type AuditCancellationsQuery = {
  receiptId?: number;
  claveSp?: string;
  payPeriodCode?: string;
  receiptPeriodCode?: string;
  nominaTipo?: number;
  limit?: number;
  offset?: number;
};

export type AuditCancellationItemDto = {
  cancellationEventId: number;
  receiptId: number;
  revisionId: number;
  claveSp: string;
  payPeriodCode: string;
  receiptPeriodCode: string;
  nominaTipo: number;
  cancelledByUserId: number;
  cancelledAt: string;
  reason: string;
  comments: string;
};

export type AuditCancellationsResponseDto = {
  total: number;
  limit: number;
  offset: number;
  items: AuditCancellationItemDto[];
};