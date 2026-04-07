export type NominaRecibosAction =
  | 'snapshots'
  | 'recibos'
  | 'sincronizacion';

export type NominaRecibosFormState = {
  versionId: string;
  releasedByUserId: string;
  comments: string;
};

export type NominaRecibosSummaryItem = {
  label: string;
  value: string;
};