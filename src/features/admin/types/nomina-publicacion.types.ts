export type LiberarVersionRequest = {
  releasedByUserId: number
  comments: string
}

export type LiberarVersionResponse = {
  versionId: number
  stage: string
  released: boolean
  releasedAt: string
}

export type SnapshotsResponse = {
  versionId: number
  stage: string
}

export type RecibosResponse = {
  versionId: number
  stage: string
  receiptsTouched: number
}

export type SyncResponse = {
  versionId: number
  stage: string
  servidorPublicoAffected: number
}